import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { X, MapPin, Navigation, Search, RotateCcw, Sparkles, Clock, Route, Phone } from 'lucide-react';

// Component RoutingMachine (Giữ nguyên)
const RoutingMachine = ({ pickupPoint, deliveryPoint, onRouteFound }) => {
  const map = useMap();
  useEffect(() => {
    if (pickupPoint && deliveryPoint) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(pickupPoint[0], pickupPoint[1]),
          L.latLng(deliveryPoint[0], deliveryPoint[1])
        ],
        routeWhileDragging: true,
        lineOptions: { styles: [{ color: '#6366F1', weight: 4 }] },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => { return null; }
      }).addTo(map);

      routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        onRouteFound(summary.totalDistance / 1000);
      });

      return () => map.removeControl(routingControl);
    }
  }, [map, pickupPoint, deliveryPoint, onRouteFound]);
  return null;
};

const DeliveryMap = ({ onAddressChange, onDistanceChange }) => {
  const [pickupPoint, setPickupPoint] = useState(null);
  const [deliveryPoint, setDeliveryPoint] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeMarkerType, setActiveMarkerType] = useState('pickup');
  
  // State danh sách tài xế
  const [drivers, setDrivers] = useState([]);

  // --- CẤU HÌNH ICON ---
  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  const deliveryIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  const createDriverIcon = () => {
    return L.divIcon({
      className: 'custom-driver-icon',
      html: `
        <div style="
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
          animation: pulse 2s infinite;
        ">
          <span style="font-size: 24px;">🚗</span>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
    });
  };

  const driverIcon = createDriverIcon();


  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost/DACN_Hutech/backend/get_drivers.php');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          console.error('Lỗi từ server:', data.message);
          return;
        }
        
        if (Array.isArray(data)) {
          const validDrivers = data.filter(driver => 
            driver && 
            driver.id && 
            driver.current_lat && 
            driver.current_lng &&
            !isNaN(parseFloat(driver.current_lat)) &&
            !isNaN(parseFloat(driver.current_lng))
          );
          
          console.log(`✅ Đã tải ${validDrivers.length} tài xế`);
          setDrivers(validDrivers);
        } else {
          console.warn('Dữ liệu tài xế không phải là mảng:', data);
          setDrivers([]);
        }
      } catch (error) {
        console.error('❌ Lỗi tải tài xế:', error);
        setDrivers([]);
      }
    };

    fetchDrivers(); // Gọi lần đầu
    
    // Cập nhật vị trí mỗi 3 giây (Hiệu ứng xe di chuyển)
    const interval = setInterval(fetchDrivers, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- CÁC HÀM XỬ LÝ KHÁC (GIỮ NGUYÊN) ---
  const handleRouteFound = (distance) => {
    setRouteDistance(distance);
    const now = new Date();
    const hour = now.getHours();
    let speed = 25;
    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) speed = 18;
    setEtaMinutes(Math.round((distance / speed) * 60));
    if (onDistanceChange) onDistanceChange(distance);
  };

  const searchLocation = async (address, isPickup) => { 
     try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPoint = [parseFloat(lat), parseFloat(lon)];
        if (isPickup) { setPickupPoint(newPoint); setActiveMarkerType('delivery'); } 
        else { setDeliveryPoint(newPoint); }
        getAddressFromCoordinates(parseFloat(lat), parseFloat(lon), isPickup);
      }
    } catch (e) { console.error(e); }
  };

  const getAddressFromCoordinates = async (lat, lng, isPickup) => { 
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if(isPickup) setPickupAddress(data.display_name); else setDeliveryAddress(data.display_name);
        if(onAddressChange) onAddressChange(data.display_name, isPickup);
      } catch(e) {}
  };

  const resetMarkers = () => {
    setPickupPoint(null); setDeliveryPoint(null);
    setPickupAddress(''); setDeliveryAddress('');
    setRouteDistance(null); setEtaMinutes(null);
    setAiExplanation(''); setActiveMarkerType('pickup');
    if (onAddressChange) { onAddressChange('', true); onAddressChange('', false); }
    if (onDistanceChange) onDistanceChange(0);
  };
  
  const clearSingleMarker = (isPickup) => {
      if (isPickup) { setPickupPoint(null); setPickupAddress(''); onAddressChange('', true); setActiveMarkerType('pickup'); } 
      else { setDeliveryPoint(null); setDeliveryAddress(''); onAddressChange('', false); setActiveMarkerType('delivery'); }
      setRouteDistance(null); setEtaMinutes(null); setAiExplanation(''); onDistanceChange(0);
  };

  const handleAskAiForRoute = async () => { 
    if (!pickupAddress || !deliveryAddress || !routeDistance || !etaMinutes) {
        alert('Vui lòng chọn đầy đủ điểm A, B và để hệ thống tính xong quãng đường trước khi hỏi AI.');
        return;
    }
    try {
        setLoadingAi(true); 
        setAiExplanation('');
        
        const now = new Date();
        const hour = now.getHours();
        let timeLabel = 'thời gian bình thường';
        if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
            timeLabel = 'giờ cao điểm, đường có thể đông';
        }
        
        const requestBody = {
            pickupAddress,
            deliveryAddress,
            distanceKm: routeDistance,
            etaMinutes,
            timeLabel
        };
        
        console.log('Gửi yêu cầu AI:', requestBody);
        
        const response = await fetch('http://localhost/DACN_Hutech/backend/route_ai_explain.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        console.log('Phản hồi từ server:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dữ liệu nhận được:', data);
        
        if (data.ok && data.text) {
            setAiExplanation(data.text);
        } else if (data.text) {
            // Nếu có text nhưng ok=false, vẫn hiển thị (có thể là thông báo lỗi từ server)
            setAiExplanation(data.text);
        } else if (data.error) {
            setAiExplanation(`Lỗi: ${data.error}`);
        } else {
            setAiExplanation('Không nhận được phản hồi từ AI. Vui lòng thử lại sau.');
        }
    } catch (error) {
        console.error('Lỗi khi gọi AI:', error);
        setAiExplanation(`Có lỗi xảy ra: ${error.message}. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.`);
    } finally { 
        setLoadingAi(false); 
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        if (activeMarkerType === 'pickup') {
          setPickupPoint([lat, lng]); await getAddressFromCoordinates(lat, lng, true); setActiveMarkerType('delivery');
        } else if (activeMarkerType === 'delivery') {
          setDeliveryPoint([lat, lng]); await getAddressFromCoordinates(lat, lng, false);
        }
      },
    });
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* CSS cho địa chỉ tooltip và driver marker */}
      <style>{`
        .custom-address-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-weight: 600 !important;
        }
        .custom-address-tooltip .leaflet-tooltip-content {
          background: white !important;
          border: 2px solid !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          margin: 0 !important;
          white-space: nowrap !important;
          max-width: 300px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .pickup-tooltip .leaflet-tooltip-content {
          border-color: #3b82f6 !important;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
        }
        .delivery-tooltip .leaflet-tooltip-content {
          border-color: #22c55e !important;
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%) !important;
        }
        .custom-address-tooltip .leaflet-tooltip-tip {
          background: white !important;
          border: 2px solid !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
        }
        .pickup-tooltip .leaflet-tooltip-tip {
          border-color: #3b82f6 !important;
        }
        .delivery-tooltip .leaflet-tooltip-tip {
          border-color: #22c55e !important;
        }
        
        /* Driver marker styles */
        .custom-driver-icon {
          background: transparent !important;
          border: none !important;
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
          }
          50% { 
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(234, 88, 12, 0.6);
          }
        }
        .custom-driver-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .custom-driver-tooltip .leaflet-tooltip-content {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
          border: 2px solid #ea580c !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3) !important;
          margin: 0 !important;
          white-space: nowrap !important;
        }
        .custom-driver-tooltip .leaflet-tooltip-tip {
          background: #fff7ed !important;
          border: 2px solid #ea580c !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
        }
      `}</style>
      {/* --- PHẦN INPUT - Cải thiện giao diện --- */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
        <div className="flex gap-4 items-start">
          {/* Điểm lấy hàng */}
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className={`w-4 h-4 ${activeMarkerType === 'pickup' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={activeMarkerType === 'pickup' ? 'text-blue-600' : 'text-gray-600'}>Điểm lấy hàng</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nhập địa chỉ lấy hàng..." 
                value={pickupAddress} 
                onChange={(e) => setPickupAddress(e.target.value)}
                className={`w-full p-3.5 border-2 rounded-xl pl-11 pr-10 focus:outline-none transition-all duration-200 ${
                  activeMarkerType === 'pickup' 
                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/30' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setActiveMarkerType('pickup')} 
              />
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${
                activeMarkerType === 'pickup' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              {pickupPoint && (
                <button 
                  onClick={() => clearSingleMarker(true)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                  title="Xóa điểm lấy hàng"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button 
              onClick={() => searchLocation(pickupAddress, true)} 
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-white">Tìm điểm giao</span>
            </button>
          </div>

          {/* Điểm giao hàng */}
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Navigation className={`w-4 h-4 ${activeMarkerType === 'delivery' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={activeMarkerType === 'delivery' ? 'text-green-600' : 'text-gray-600'}>Điểm giao hàng</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nhập địa chỉ giao hàng..." 
                value={deliveryAddress} 
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className={`w-full p-3.5 border-2 rounded-xl pl-11 pr-10 focus:outline-none transition-all duration-200 ${
                  activeMarkerType === 'delivery' 
                    ? 'border-green-500 ring-2 ring-green-200 bg-green-50/30' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setActiveMarkerType('delivery')} 
              />
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${
                activeMarkerType === 'delivery' ? 'text-green-600' : 'text-gray-400'
              }`} />
              {deliveryPoint && (
                <button 
                  onClick={() => clearSingleMarker(false)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                  title="Xóa điểm giao hàng"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button 
              onClick={() => searchLocation(deliveryAddress, false)} 
              className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-white">Tìm điểm Đến</span>
            </button>
          </div>

          {/* Nút Reset */}
          <div className="flex flex-col items-center justify-center pt-7">
            <button 
              onClick={resetMarkers} 
              className="h-14 w-14 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-full hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group"
              title="Đặt lại tất cả"
            >
              <RotateCcw className="w-6 h-6 text-gray-700 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <span className="text-xs text-gray-500 mt-1 font-medium">Đặt lại</span>
          </div>
        </div>
      </div>

      {/* --- BẢN ĐỒ --- */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative" style={{ height: '600px' }}>
        {/* Hiển thị số lượng tài xế */}
        {drivers.length > 0 && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚗</span>
              <span className="text-sm font-semibold text-gray-700">
                {drivers.length} tài xế đang hoạt động
              </span>
            </div>
          </div>
        )}
        <MapContainer 
          center={[10.8231, 106.6297]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }} 
          className="relative z-0"
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; OpenStreetMap contributors' 
          />
          <MapClickHandler />
          
          {pickupPoint && pickupAddress && (
            <Marker position={pickupPoint} icon={pickupIcon}>
              <Tooltip 
                permanent 
                direction="top" 
                offset={[0, -45]}
                className="custom-address-tooltip pickup-tooltip"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '280px' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#2563eb', flexShrink: 0 }} />
                  <span style={{ 
                    fontWeight: 600, 
                    color: '#1e40af', 
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {pickupAddress.length > 50 ? pickupAddress.substring(0, 47) + '...' : pickupAddress}
                  </span>
                </div>
              </Tooltip>
              <Popup className="custom-popup">
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-600">Điểm lấy hàng</span>
                  </div>
                  <p className="text-sm text-gray-700">{pickupAddress}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {deliveryPoint && deliveryAddress && (
            <Marker position={deliveryPoint} icon={deliveryIcon}>
              <Tooltip 
                permanent 
                direction="top" 
                offset={[0, -45]}
                className="custom-address-tooltip delivery-tooltip"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '280px' }}>
                  <Navigation style={{ width: '16px', height: '16px', color: '#16a34a', flexShrink: 0 }} />
                  <span style={{ 
                    fontWeight: 600, 
                    color: '#15803d', 
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {deliveryAddress.length > 50 ? deliveryAddress.substring(0, 47) + '...' : deliveryAddress}
                  </span>
                </div>
              </Tooltip>
              <Popup className="custom-popup">
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">Điểm giao hàng</span>
                  </div>
                  <p className="text-sm text-gray-700">{deliveryAddress}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* --- RENDER TÀI XẾ --- */}
          {drivers.map((driver) => {
            // Kiểm tra dữ liệu hợp lệ
            if (!driver.current_lat || !driver.current_lng || 
                isNaN(parseFloat(driver.current_lat)) || isNaN(parseFloat(driver.current_lng))) {
              console.warn('Driver có dữ liệu vị trí không hợp lệ:', driver);
              return null;
            }

            const driverLat = parseFloat(driver.current_lat);
            const driverLng = parseFloat(driver.current_lng);

            return (
              <Marker 
                key={`driver-${driver.id}`} 
                position={[driverLat, driverLng]} 
                icon={driverIcon}
              >
                <Tooltip 
                  permanent 
                  direction="top" 
                  offset={[0, -50]}
                  className="custom-driver-tooltip"
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontWeight: 600,
                    color: '#ea580c',
                    fontSize: '12px'
                  }}>
                    <span>🚗</span>
                    <span>{driver.full_name || 'Tài xế'}</span>
                  </div>
                </Tooltip>
                <Popup className="custom-popup">
                  <div className="p-3 min-w-[220px]">
                    {/* Header: Tên và Đánh giá */}
                    <div className="border-b border-gray-200 pb-3 mb-3">
                      <h3 className="font-bold text-gray-800 text-base m-0 mb-2">{driver.full_name || 'Tài xế'}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-500 text-sm">
                          <span className="mr-1 text-lg">★</span>
                          <span className="font-semibold text-gray-700">{driver.avg_rating || '5.0'}</span>
                          <span className="text-gray-400 text-xs ml-1">({driver.total_reviews || 0} đánh giá)</span>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                          Đang rảnh
                        </span>
                      </div>
                    </div>
                    
                    {/* Body: Thông tin liên hệ */}
                    <div className="text-sm text-gray-600">
                      {driver.phone_number && (
                        <div className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <a 
                            href={`tel:${driver.phone_number}`} 
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {driver.phone_number}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {pickupPoint && deliveryPoint && (
            <RoutingMachine 
              pickupPoint={pickupPoint} 
              deliveryPoint={deliveryPoint} 
              onRouteFound={handleRouteFound} 
            />
          )}
        </MapContainer>
      </div>

      {/* --- KẾT QUẢ - Cải thiện card hiển thị --- */}
      {routeDistance !== null && routeDistance > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Thông tin tuyến đường</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Khoảng cách */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-lg p-2.5">
                  <Route className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Khoảng cách</p>
                  <p className="text-2xl font-bold text-blue-600">{routeDistance.toFixed(2)} km</p>
                </div>
              </div>
            </div>

           
          </div>

          {/* Nút hỏi AI */}
          <button 
            onClick={handleAskAiForRoute} 
            disabled={loadingAi} 
            className={`w-full px-6 py-3.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              loadingAi 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            }`}
          >
            {loadingAi ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang phân tích...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white">Hỏi AI về tuyến đường</span>
              </>
            )}
          </button>

          {/* Kết quả AI */}
          {aiExplanation && (
            <div className="mt-4 p-4 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-2">Phân tích từ AI</h4>
                  <p className="text-sm text-purple-800 leading-relaxed">{aiExplanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;