import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { X } from 'lucide-react'; // Import icon X

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
        lineOptions: {
          styles: [{ color: '#6366F1', weight: 4 }]
        },
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
  const [etaMinutes, setEtaMinutes] = useState(null); // thời gian ước tính (phút)
  const [aiExplanation, setAiExplanation] = useState(''); // giải thích từ AI
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [activeMarkerType, setActiveMarkerType] = useState('pickup');

  const handleRouteFound = (distance) => {
    setRouteDistance(distance);

    // ƯỚC TÍNH THỜI GIAN: giả sử tốc độ trung bình 25km/h, nếu giờ cao điểm thì thấp hơn
    const now = new Date();
    const hour = now.getHours();
    let speed = 25; // km/h

    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
      // giờ cao điểm -> giảm tốc độ
      speed = 18;
    }

    const hours = distance / speed;
    const minutes = Math.round(hours * 60);
    setEtaMinutes(minutes);

    if (onDistanceChange) {
      onDistanceChange(distance);
    }
  };

  const searchLocation = async (address, isPickup) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPoint = [parseFloat(lat), parseFloat(lon)];

        if (isPickup) {
          setPickupPoint(newPoint);
          setActiveMarkerType('delivery');
        } else {
          setDeliveryPoint(newPoint);
        }
        getAddressFromCoordinates(parseFloat(lat), parseFloat(lon), isPickup);
      } else {
        alert('Không tìm thấy địa chỉ. Vui lòng thử lại với địa chỉ khác.');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm địa chỉ:', error);
      alert('Có lỗi xảy ra khi tìm kiếm địa chỉ. Vui lòng thử lại.');
    }
  };

  const getAddressFromCoordinates = async (lat, lng, isPickup) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.display_name;
      
      if (isPickup) {
        setPickupAddress(address);
      } else {
        setDeliveryAddress(address);
      }

      if (onAddressChange) {
        onAddressChange(address, isPickup);
      }
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
    }
  };

  const clearSingleMarker = (isPickup) => {
      if (isPickup) {
          setPickupPoint(null);
          setPickupAddress('');
          onAddressChange('', true);
          setActiveMarkerType('pickup'); 
      } else {
          setDeliveryPoint(null);
          setDeliveryAddress('');
          onAddressChange('', false);
          setActiveMarkerType('delivery'); 
      }
      setRouteDistance(null); 
      setEtaMinutes(null);
      setAiExplanation('');
      onDistanceChange(0);
  };

  const resetMarkers = () => {
    setPickupPoint(null);
    setDeliveryPoint(null);
    setPickupAddress('');
    setDeliveryAddress('');
    setRouteDistance(null);
    setEtaMinutes(null);
    setAiExplanation('');
    setActiveMarkerType('pickup');
    if (onAddressChange) {
      onAddressChange('', true);
      onAddressChange('', false);
    }
    if (onDistanceChange) {
      onDistanceChange(0);
    }
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

      const response = await fetch('http://localhost/DACN_Hutech/backend/route_ai_explain.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickupAddress,
          deliveryAddress,
          distanceKm: routeDistance,
          etaMinutes,
          timeLabel,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        setAiExplanation(data.text);
      } else {
        setAiExplanation(data.text || 'Không nhận được giải thích từ AI.');
      }
    } catch (error) {
      console.error('Lỗi khi gọi AI giải thích lộ trình:', error);
      setAiExplanation('Có lỗi xảy ra khi kết nối AI. Vui lòng thử lại sau.');
    } finally {
      setLoadingAi(false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        
        if (activeMarkerType === 'pickup') {
          setPickupPoint([lat, lng]);
          await getAddressFromCoordinates(lat, lng, true);
          setActiveMarkerType('delivery');
        } else if (activeMarkerType === 'delivery') {
          setDeliveryPoint([lat, lng]);
          await getAddressFromCoordinates(lat, lng, false);
        }
      },
    });
    return null;
  };

  // Icon tùy chỉnh cho điểm A (Lấy hàng)
  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Icon tùy chỉnh cho điểm B (Giao hàng)
  const deliveryIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  return (
    <div className="h-[600px] w-full">
      <div className="mb-4 flex gap-6">
        {/* Điểm A: Lấy hàng */}
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập điểm lấy hàng"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg pl-10 pr-10 focus:outline-none focus:border-[#3b5f8a] transition-all ${activeMarkerType === 'pickup' ? 'border-[#4e7cb2] ring-2 ring-[#4e7cb2]' : 'border-gray-300'}`}
              onClick={() => setActiveMarkerType('pickup')}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {/* NÚT XÓA RIÊNG LẺ */}
            {pickupPoint && (
                <button 
                    onClick={() => clearSingleMarker(true)} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                    title="Xóa điểm lấy hàng"
                >
                    <X className="w-5 h-5"/>
                </button>
            )}
          </div>
          <button
            onClick={() => searchLocation(pickupAddress, true)}
            className="mt-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm điểm A
          </button>
        </div>

        {/* Điểm B: Giao hàng */}
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập điểm giao hàng"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg pl-10 pr-10 focus:outline-none focus:border-[#3b5f8a] transition-all ${activeMarkerType === 'delivery' ? 'border-green-600 ring-2 ring-green-600' : 'border-gray-300'}`}
              onClick={() => setActiveMarkerType('delivery')}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
             {/* NÚT XÓA RIÊNG LẺ */}
            {deliveryPoint && (
                <button 
                    onClick={() => clearSingleMarker(false)} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                    title="Xóa điểm giao hàng"
                >
                    <X className="w-5 h-5"/>
                </button>
            )}
          </div>
          <button
            onClick={() => searchLocation(deliveryAddress, false)}
            className="mt-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm điểm B
          </button>
        </div>

        <button
          onClick={resetMarkers}
          className="font-bold absolute top-30 right-0 z-80 h-16 w-16 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 shadow-md self-end"
          title="Reset toàn bộ bản đồ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.76L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.76L21 16"/><path d="M16 16h5v5"/></svg>
        </button>
      </div>

      <MapContainer
        center={[10.8231, 106.6297]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="relative rounded-xl shadow-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {pickupPoint && (
          <Marker position={pickupPoint} icon={pickupIcon}>
            <Popup>Điểm A: {pickupAddress}</Popup>
          </Marker>
        )}
        {deliveryPoint && (
          <Marker position={deliveryPoint} icon={deliveryIcon}>
            <Popup>Điểm B: {deliveryAddress}</Popup>
          </Marker>
        )}
        {pickupPoint && deliveryPoint && (
          <RoutingMachine
            pickupPoint={pickupPoint}
            deliveryPoint={deliveryPoint}
            onRouteFound={handleRouteFound}
          />
        )}
      </MapContainer>
      {routeDistance !== null && routeDistance > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md space-y-3">
          <p className="text-[#4e7cb2] font-semibold">
            Khoảng cách đường đi thực tế: {routeDistance.toFixed(2)} km
          </p>
          {etaMinutes !== null && (
            <p className="text-gray-700">
              Thời gian giao hàng ước tính: khoảng <span className="font-semibold">{etaMinutes} phút</span>
              {' '}
              (dựa trên tốc độ trung bình và khung giờ hiện tại)
            </p>
          )}

          <button
            onClick={handleAskAiForRoute}
            disabled={loadingAi}
            className={`mt-2 px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all duration-300 
              ${loadingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {loadingAi ? 'AI đang phân tích lộ trình...' : 'Hỏi AI giải thích lộ trình'}
          </button>

          {aiExplanation && (
            <div className="mt-2 p-3 border border-purple-200 rounded-lg bg-purple-50 text-sm text-gray-800 whitespace-pre-line">
              {aiExplanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;