import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chart from '../Chart';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'antd';

// 가상의 DB에서 읽어온 전기모빌리티 배터리충전 스테이션 값들을 가정합니다.
const dbStations = [
  { id: 1, lat: 37.5665, lng: 126.9780, name: 'Station A' },
  { id: 2, lat: 37.5710, lng: 126.9787, name: 'Station B' },
];

function MainComponent({setPage}) {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // 바뀜 - 시작
  const [mobilities, setMobilities] = useState([]);
  const [stations2, setStations2] = useState([]);
  
  const mobilitiesColumnStructure = [
    { title: '모빌리티 ID ', dataIndex: 'mobillityName', key: 'mobillityName' },
    { title: '운영상태', dataIndex: 'operationalStatus', key: 'operationalStatus' },
  ];

  const stationColumnStructure = [
    { title: '스테이션명 ', dataIndex: 'station_name', key: 'station_name' },
    { title: '운영상태', dataIndex: 'operationalStatus', key: 'operationalStatus' },
    { title: '총 모빌리티 수', dataIndex: 'total_cnt', key: 'total_cnt' },
    { title: '사용가능한 모빌리티 수', dataIndex: 'use_cnt', key: 'use_cnt' },
  ];

  const fetchMobilities = async () => {
    try {
      const response = await axios.get('/api/mobilities');

      const data = [];
      let index = 1;
      response.data.forEach(mobility => {
        const format = {
          "key" : (index++).toString(),
          "mobillityName" : mobility.mobility_id,
          "operationalStatus" : mobility.operationalStatus,
        }
        data.push(format)
      });
      setMobilities(data);
    } catch (error) {
      console.error('Error fetching mobilities:', error);
    }
  };

  const fetchStation = async () => {
    try{
      const response = await axios.get('/api/station');

      const data = [];
      let index = 1;
      for(const station of response.data){
        const cntResponse = await axios.get(`/api/moblility/${station.station_id}`);
        const total_cnt = parseInt(cntResponse.data[0].total_cnt);
        const using_cnt = parseInt(cntResponse.data[0].using_cnt);

        const format = {
          "key" : (index++).toString(),
          "station_name" : station.station_name,
          "operationalStatus" : station.operationalStatus == "o" ? "운영중" : "정지",
          "total_cnt" : total_cnt,
          "use_cnt" : total_cnt - using_cnt
        }
        data.push(format)
      }
      setStations2(data);
      
        
    } catch(error){
      console.error("Error fetching stations:", error);
    }
  }

  useEffect(() => {
    fetchMobilities();
    fetchStation();
    setStations(dbStations);
    const interval1 = setInterval(fetchMobilities, 5000); // 5초마다 모빌리티 정보 업데이트
    const interval2 = setInterval(fetchStation, 5000); // 5초마다 모빌리티 정보 업데이트
    return () => {clearInterval(interval1); clearInterval(interval2);};
    // 바뀜 - 끝

    
  }, []);

  const handleMarkerMouseEnter = (station) => {
    setSelectedStation(station);
  };

  const handleMarkerMouseLeave = () => {
    setSelectedStation(null);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} marginTop={5}>
        <Typography component="h2" variant="primary" color="gray" align='center'>Map</Typography>
        <Paper style={{ height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Map center={{ lat: 37.5665, lng: 126.9780 }} style={{ width: "100%", height: "100%" }}>
            {stations.map((station) => (
              <MapMarker
                key={station.id}
                position={{ lat: station.lat, lng: station.lng }}
                onMouseOver={() => handleMarkerMouseEnter(station)}
                onMouseOut={() => handleMarkerMouseLeave()}
              >
                {selectedStation === station && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "white",
                      padding: "5px"
                    }}
                  >
                    Station Name:{station.name}
                  </div>
                )}
              </MapMarker>
            ))}
          </Map>
        </Paper>
      </Grid>

      {/* 모빌리티 운영상황 바뀜*/}
      <Grid item xs={12} md={6} marginTop={5}>
      <Typography component="h2" variant="primary" color="gray" align='center'>모빌리티 운영상황</Typography>
      <Table dataSource={mobilities} columns={mobilitiesColumnStructure} ></Table>
      
      {/* 스테이션 운영상황 바뀜*/}
      <Typography component="h2" variant="primary" color="gray" align='center'>스테이션 운영상황</Typography>
      <Table dataSource={stations2} columns={stationColumnStructure} ></Table>
    </Grid>
    </Grid>
  );
}

export default MainComponent;
