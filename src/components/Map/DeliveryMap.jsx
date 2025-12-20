import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { X } from 'lucide-react';

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

  // Icon Tài xế (Xe Van màu cam)
  const driverIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', 
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  // --- LOGIC FETCH TÀI XẾ (POLLING) ---
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost/DACN_Hutech/backend/get_drivers.php');
        const data = await response.json();
        if (Array.isArray(data)) {
          setDrivers(data);
        }
      } catch (error) {
        console.error('Lỗi tải tài xế:', error);
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
        setLoadingAi(true); setAiExplanation('');
        const now = new Date();
        const hour = now.getHours();
        let timeLabel = 'thời gian bình thường';
        if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) timeLabel = 'giờ cao điểm, đường có thể đông';
        const response = await fetch('http://localhost/DACN_Hutech/backend/route_ai_explain.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pickupAddress, deliveryAddress, distanceKm: routeDistance, etaMinutes, timeLabel }),
        });
        const data = await response.json();
        setAiExplanation(data.ok ? data.text : (data.text || 'Không nhận được giải thích từ AI.'));
    } catch (error) {
        setAiExplanation('Có lỗi xảy ra khi kết nối AI.');
    } finally { setLoadingAi(false); }
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
    <div className="h-[600px] w-full">
      {/* --- PHẦN INPUT --- */}
      <div className="mb-4 flex gap-6">
        <div className="flex-1 relative">
           <input type="text" placeholder="Nhập điểm lấy hàng" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg pl-10 pr-10 focus:outline-none transition-all ${activeMarkerType === 'pickup' ? 'border-[#4e7cb2] ring-2 ring-[#4e7cb2]' : 'border-gray-300'}`}
              onClick={() => setActiveMarkerType('pickup')} />
            {pickupPoint && <button onClick={() => clearSingleMarker(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"><X className="w-5 h-5"/></button>}
            <button onClick={() => searchLocation(pickupAddress, true)} className="mt-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">Tìm điểm A</button>
        </div>
        <div className="flex-1 relative">
           <input type="text" placeholder="Nhập điểm giao hàng" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg pl-10 pr-10 focus:outline-none transition-all ${activeMarkerType === 'delivery' ? 'border-green-600 ring-2 ring-green-600' : 'border-gray-300'}`}
              onClick={() => setActiveMarkerType('delivery')} />
            {deliveryPoint && <button onClick={() => clearSingleMarker(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"><X className="w-5 h-5"/></button>}
            <button onClick={() => searchLocation(deliveryAddress, false)} className="mt-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md">Tìm điểm B</button>
        </div>
        <button onClick={resetMarkers} className="h-16 w-16 bg-white border border-gray-300 rounded-full hover:bg-gray-200 shadow-md flex items-center justify-center">
            Reset
        </button>
      </div>

      {/* --- BẢN ĐỒ --- */}
      <MapContainer center={[10.8231, 106.6297]} zoom={13} style={{ height: '100%', width: '100%' }} className="relative rounded-xl shadow-lg z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
        <MapClickHandler />
        
        {pickupPoint && <Marker position={pickupPoint} icon={pickupIcon}><Popup>Điểm A: {pickupAddress}</Popup></Marker>}
        {deliveryPoint && <Marker position={deliveryPoint} icon={deliveryIcon}><Popup>Điểm B: {deliveryAddress}</Popup></Marker>}

        {/* --- RENDER TÀI XẾ (Chỉ hiển thị thông tin, không có nút chọn) --- */}
        {drivers.map((driver) => (
          <Marker key={driver.id} position={[driver.current_lat, driver.current_lng]} icon={driverIcon}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                {/* Header: Tên và Đánh giá */}
                <div className="border-b pb-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-base m-0">{driver.full_name}</h3>
                  <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-yellow-500 text-sm">
                        <span className="mr-1">★</span><span className="font-semibold text-gray-700">{driver.avg_rating}</span>
                        <span className="text-gray-400 text-xs ml-1">({driver.total_reviews} đánh giá)</span>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Đang rảnh</span>
                  </div>
                </div>
                
                {/* Body: Thông tin liên hệ (Chỉ xem) */}
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-center">📞</span>
                    <a href={`tel:${driver.phone_number}`} className="text-blue-600 hover:underline">{driver.phone_number}</a>
                  </div>
                </div>
                
              </div>
            </Popup>
          </Marker>
        ))}

        {pickupPoint && deliveryPoint && <RoutingMachine pickupPoint={pickupPoint} deliveryPoint={deliveryPoint} onRouteFound={handleRouteFound} />}
      </MapContainer>

      {/* --- KẾT QUẢ --- */}
      {routeDistance !== null && routeDistance > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md space-y-3">
          <p className="text-[#4e7cb2] font-semibold">Khoảng cách: {routeDistance.toFixed(2)} km</p>
          <p className="text-gray-700">Thời gian ước tính: <span className="font-semibold">{etaMinutes} phút</span></p>
          <button onClick={handleAskAiForRoute} disabled={loadingAi} className={`mt-2 px-4 py-2 rounded-lg text-white font-medium ${loadingAi ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}>{loadingAi ? 'Đang phân tích...' : 'Hỏi AI'}</button>
          {aiExplanation && <div className="mt-2 p-3 border border-purple-200 rounded-lg bg-purple-50 text-sm">{aiExplanation}</div>}
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;