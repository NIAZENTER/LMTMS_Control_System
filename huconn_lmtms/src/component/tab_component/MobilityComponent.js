import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import axios from 'axios';
import { Typography, Box, CardContent, Card } from '@mui/material';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const MobilityComponent = ({setPage}) => {
  const [mobilities, setMobilities] = useState([]);
  const [selectedMobility, setSelectedMobility] = useState(null);
  const [userData, setUserData] = useState([]);
  const [batteryData, setBatteryData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });// 기본 지도 센터 위치 (서울)

  const fetchMobilities = async () => {
    try {
      const response = await axios.get('/api/mobilities');
      setMobilities(response.data);
    } catch (error) {
      console.error('Error fetching mobilities:', error);
    }
  };

  useEffect(() => {
    fetchMobilities();
    const interval = setInterval(fetchMobilities, 5000); // 5초마다 모빌리티 정보 업데이트
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedMobility) {
      if (selectedMobility.battery_id) {
        axios.get(`/api/battery/${selectedMobility.battery_id}`).then((response) => setBatteryData(response.data));
      }
      if (selectedMobility.user_id) { // selectedMobility가 정의된 경우에만 user_id를 참조
        axios.get(`/api/user/${selectedMobility.user_id}`).then((response) => { setUserData(response.data) });
      }
    }
    else {
      setUserData([]);
      setBatteryData([]);
    }

  }, [selectedMobility]);

  const handleMobilitySelect = (mobility) => {
    setSelectedMobility(mobility);
  };

  const renderMarkers = () => {
    return mobilities.map((mobility) => (
      <MapMarker
        key={mobility.mobility_id}
        position={{ lat: mobility.lat, lng: mobility.lng }}
        onClick={() => handleMobilitySelect(mobility)}
      />
    ));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 위쪽 지도 */}
      <Box sx={{ width: '100%', height: '50%', padding: "10px" }}>
        <Map center={mapCenter} style={{ width: '100%', height: '100%' }}>
          {renderMarkers()}
        </Map>
      </Box>

      {/* 우측 모빌리티 목록 */}
      <Box sx={{ width: '100%', height: '50%', overflowY: 'scroll', display:"flex", flexWrap: "nowrap" }}>
      <Card sx={{ flexGrow: 1 }}>
      <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button variant="primary" style={{ margin: '0 auto' }}>모빌리티 목록</Button>
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
            {mobilities.map((mobility) => (
              <li
                key={mobility.mobility_id}
                onClick={() => handleMobilitySelect(mobility)}
                style={{
                  fontWeight: mobility === selectedMobility ? 'bold' : 'normal',
                  cursor: "pointer",
                  backgroundColor : mobility === selectedMobility ? "#3f51b5" : "transparent",
                  color : mobility === selectedMobility ? "#fff" : "black",
                  textDecoration : mobility === selectedMobility ? "underline" : "none"
                }}
              >
                모빌리티 ID: {mobility.mobility_id}, {mobility.operationalStatus}, {mobility.battery_level}
              </li>
            ))}
          </CardContent>
        </Card>
        {/* 바뀜 */}
        <Card sx={{ flexGrow: 1 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button variant="primary" style={{ margin: '0 auto' }}>선택된 모빌리티 정보</Button>
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
            {selectedMobility ? (
              <div>
                <p>모빌리티 ID: {selectedMobility.mobility_id}</p>
                <p>모빌리티 이름: {selectedMobility.modelName}</p>
                <p>모빌리티 운영상태: {selectedMobility.operationalStatus}</p>
                <p>모빌리티 배터리 ID: {selectedMobility.battery_id}</p>
                <p>모빌리티 총 운행거리: {selectedMobility.total_distance}</p>
                <p>모빌리티 사용자 ID: {selectedMobility.user_id}</p>
                <p>모빌리티 배터리 충전량: {selectedMobility.battery_level}</p>

                {/* 추가적인 모빌리티 정보 표시 (충전상태 등) */}
              </div>
            ) : (
              <div>
                <p>모빌리티 ID: </p>
                <p>모빌리티 이름: </p>
                <p>모빌리티 운영상태: </p>
                <p>모빌리티 배터리 ID: </p>
                <p>모빌리티 총 운행거리: </p>
                <p>모빌리티 사용자 ID: </p>
                <p>모빌리티 배터리 충전량: </p>
              </div>
            )}


          </CardContent>
        </Card>
        {/* 바뀜 */}
        <Card sx={{ flexGrow: 1 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button variant="primary" style={{ margin: '0 auto' }} onClick={() => {setPage && setPage("BAT STATUS")}}>선택된 배터리 정보</Button>
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
            {batteryData.length > 0 ? (<div>
              <p>배터리 ID: {batteryData[0].battery_id}</p>
              <p>배터리 모델: {batteryData[0].battery_model}</p>
              <p>충전 여부: {batteryData[0].battery_charging}</p>
              <p>충전율: {batteryData[0].battery_percent}</p>
              <p>온도: {batteryData[0].battery_temperature}</p>
            </div>) : (
              <div>
                <p>배터리 ID: </p>
                <p>배터리 모델: </p>
                <p>충전 여부: </p>
                <p>충전율: </p>
                <p>온도: </p>
              </div>
            )}
          </CardContent>
        </Card>
        {/* 바뀜 */}
        <Card sx={{ flexGrow: 1 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button variant="primary" style={{ margin: '0 auto' }} onClick={() => {setPage && setPage("USER")}}>선택된 유저 정보</Button>
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
            {userData.length > 0 ? <div>
              <p>사용자 ID: {userData[0].user_id}</p>
              <p>등록일: {userData[0].Registration_date}</p>
              <p>휴대폰 번호: {userData[0].Phone_number}</p>
              <p>이름: {userData[0].user_name}</p>
              <p>이메일: {userData[0].user_email}</p>
            </div> : (
              <div>
                <p>사용자 ID: </p>
                <p>등록일: </p>
                <p>총 사용량: </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box >
  );
};

export default MobilityComponent;