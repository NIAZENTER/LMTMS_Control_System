import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import axios from "axios";
import { Typography, Box, CardContent, Card } from '@mui/material';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


const StationComponent = ({setPage}) => {
  const [station, setStation] = useState([]);
  const [charger, setCharger] = useState([]);
  const [mobility, setMobility] = useState([]);
  const [selectedStation, setSelectedStation] = useState("null");
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });

  //const [mapLoaded, setMapLoaded] = useState(false);

  const fetchStation = async () => {
    try {

      const response = await axios.get("/api/station");
      setStation(response.data);
      console.log(station);
      console.log("dddd");
    } catch (error) {
      console.error("Error fetching station:", error);
    }
  };


  const fetchCharger = async (station_id) => {
    try {
      const response = await axios.get(`/api/charger/${station_id}`);
      setCharger(response.data);
    } catch (error) {
      console.error("Error fetching charger:", error);
    }
  };

  const fectchMobility = async (battery_model) => {
    try {
      const response = await axios.get(`/api/mobilities?battery_model=${battery_model}`);
      setMobility(response.data);
    } catch (error) {
      console.error("Error fetching mobility:", error);
    }
  }

  useEffect(() => {
    fetchStation();
  }, []);

  useEffect(() => {
    fetchCharger(selectedStation.station_id);
  }, [selectedStation]);

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    fetchCharger(station.station_id);
    setMobility([]);
  };

  useEffect(() => {
    fetchCharger(selectedStation.station_id);
    // 선택된 스테이션의 위치로 지도 센터 변경
    if (selectedStation !== "null") {
      setMapCenter({ lat: selectedStation.station_lat, lng: selectedStation.station_lng });
    }
  }, [selectedStation]);


  const renderMarkers = () => {
    return station.map((station) => (
      <MapMarker
        key={station.station_id}
        position={{ lat: station.station_lat, lng: station.station_lng }}
        onClick={() => handleStationSelect(station)}
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
      {/* 아래쪽 데이터 */}
      <Box sx={{ width: '100%', height: '50%', overflowY: 'scroll', display:"flex", flexWrap: "nowrap" }}>
        {/* 스테이션 목록 */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button style={{ margin: '0 auto' }} sx={{ backgroundColor: theme => theme.palette.primary.main, fontFamily: 'Arial', letterSpacing: 2, textTransform: 'uppercase' }} variant="primary">스테이션 목록</Button>
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
            <ul>
              {station.map((station) => (
                <li
                  key={station.station_id}
                  onClick={() => handleStationSelect(station)}
                  style={{
                    backgroundColor : station === selectedStation ? "#3f51b5" : "transparent",
                    color : station === selectedStation ? "#fff" : "black",
                    textDecoration : station === selectedStation ? "underline" : "none"
                  }}
                >
                  스테이션 ID: {station.station_id}

                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 선택된 스테이션 정보 바뀜*/}
        <Card sx={{ flexGrow: 1 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Button variant="primary" style={{ margin: '0 auto' }}>선택된 스테이션 정보</Button>
        <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
              <div>
                <p>스테이션 ID: {selectedStation !== "null" ? selectedStation.station_id : ""}</p>
                <p>스테이션 이름: {selectedStation !== "null" ? selectedStation.station_name : ""}</p>
                <p>스테이션 위도: {selectedStation !== "null" ? selectedStation.station_lat : ""}</p>
                <p>스테이션 경도: {selectedStation !== "null" ? selectedStation.station_lng : ""}</p>
                <p>스테이션 주소: {selectedStation !== "null" ? selectedStation.station_address : ""}</p>
              </div>
              
          </CardContent>
        </Card>

        {/* 충전기 정보 바뀜*/}
        <Card sx={{ flexGrow: 1 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button style={{ margin: '0 auto' }} variant="primary" onClick={() => setPage && setPage("BAT STATUS")}>충전기 정보</Button>
              <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
              {charger.length > 0 ? charger.map((charger) => ( 
                <div onClick={() => fectchMobility(charger.battery_model)}
                  key={charger.charger_id}
                  style={{ cursor: "pointer" }}>
                  <p>충전기 ID: {charger.chager_id}</p>
                  <p>타임 스탬프: {charger.timestamp}</p>
                  <p>배터리 ID: {charger.battery_model}</p>
                  <p style={{ cursor: "pointer", textDecoration: "underline" }}>운영상태: {charger.operationalStatus === "o" ? "가동 중" : "정지"}</p>
                  <p>----------------------------------</p>
                </div>
              )) : (<div>
                <p>충전기 ID: </p>
                  <p>타임 스탬프: </p>
                  <p>배터리 ID: </p>
                  <p style={{ cursor: "pointer", textDecoration: "underline" }}>운영상태:</p>
              </div>)}
            </CardContent>
          </Card>
        

        {/* 모빌리티 정보 바뀜*/}
        <Card sx={{ flexGrow: 1 }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Button variant="primary" style={{ margin: '0 auto' }} onClick={() => setPage && setPage("MOBILITY")}>모빌리티정보</Button>
              <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
              {
                mobility.length > 0 ? mobility.map((mobility) => (
                  <div>
                    <p>모빌리티 ID: {mobility.mobility_id}</p>
                    <p>모빌리티 이름: {mobility.mobillityName}</p>
                    <p>모빌리티 운영상태: {mobility.operationalStatus}</p>
                    <p>모빌리티 배터리 ID: {mobility.battery_id}</p>
                    <p>모빌리티 총 운행거리: {mobility.total_distance}</p>
                    <p>모빌리티 사용자 ID: {mobility.user_id}</p>
                    <p>모빌리티 배터리 충전량: {mobility.battery_level}</p>
                    <p>총 모빌리티 수: {mobility.total_cnt}</p>
                    <p>사용가능한 모빌리티 수: {mobility.total_cnt - mobility.using_cnt}</p>
                    <p>----------------------------------</p>
                  </div>
                ))
              : (
                <div>
                  <p>모빌리티 ID: </p>
                    <p>모빌리티 이름: </p>
                    <p>모빌리티 운영상태: </p>
                    <p>모빌리티 배터리 ID: </p>
                    <p>모빌리티 총 운행거리: </p>
                    <p>모빌리티 사용자 ID: </p>
                    <p>모빌리티 배터리 충전량: </p>
                    <p>총 모빌리티 수: </p>
                    <p>사용가능한 모빌리티 수: </p>
                </div>
              )}
            </CardContent>
          </Card>
      </Box>
    </Box >
  );
};
export default StationComponent;