import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

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

  const handleRouteFound = (distance) => {
    setRouteDistance(distance);
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
        if (isPickup) {
          setPickupPoint([parseFloat(lat), parseFloat(lon)]);
        } else {
          setDeliveryPoint([parseFloat(lat), parseFloat(lon)]);
        }
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

  const resetMarkers = () => {
    setPickupPoint(null);
    setDeliveryPoint(null);
    setPickupAddress('');
    setDeliveryAddress('');
    setRouteDistance(null);
    if (onAddressChange) {
      onAddressChange('', true);
      onAddressChange('', false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        if (pickupPoint && deliveryPoint) {
          resetMarkers();
          setPickupPoint([lat, lng]);
          await getAddressFromCoordinates(lat, lng, true);
        } else if (!pickupPoint) {
          setPickupPoint([lat, lng]);
          await getAddressFromCoordinates(lat, lng, true);
        } else if (!deliveryPoint) {
          setDeliveryPoint([lat, lng]);
          await getAddressFromCoordinates(lat, lng, false);
        }
      },
    });
    return null;
  };

  return (
    <div className="h-[600px] w-full">
      <div className="mb-4 flex gap-6">
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập điểm lấy hàng"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="w-full p-3 border-2 border-[#4e7cb2] rounded-lg pl-10 focus:outline-none focus:border-[#3b5f8a] transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <button
            onClick={() => searchLocation(pickupAddress, true)}
            className="mt-2 w-full px-4 py-2.5 bg-[#4e7cb2] text-white rounded-lg hover:bg-[#3b5f8a] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm điểm lấy hàng
          </button>
        </div>
        <div className="flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập điểm giao hàng"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full p-3 border-2 border-[#4e7cb2] rounded-lg pl-10 focus:outline-none focus:border-[#3b5f8a] transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-2 top-1/2 transform -translate-y-1/2 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <button
            onClick={() => searchLocation(deliveryAddress, false)}
            className="mt-2 w-full px-4 py-2.5 bg-[#4e7cb2] text-white rounded-lg hover:bg-[#3b5f8a] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm điểm giao hàng
          </button>
        </div>
        <button
          onClick={resetMarkers}
          className="font-bold absolute top-30 right-0 z-80 h-16 w-16 bg-white text-[#4e7cb2] white rounded-full hover:bg-[#9b89f1] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md self-end"
        >
           Xóa Điểm
        
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
          <Marker position={pickupPoint}>
            <Popup>Điểm lấy hàng</Popup>
          </Marker>
        )}
        {deliveryPoint && (
          <Marker position={deliveryPoint}>
            <Popup>Điểm giao hàng</Popup>
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
      {routeDistance && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <p className="text-[#4e7cb2] font-semibold">
            Khoảng cách đường đi thực tế: {routeDistance.toFixed(2)} km
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;