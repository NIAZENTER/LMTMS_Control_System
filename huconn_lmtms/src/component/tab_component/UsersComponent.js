import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Table } from 'antd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const UsersComponent = ({setPage}) => {
  const [user_dataSource, user_setDataSource] = useState([]);
  const [user_columns, user_setColumns] = useState([]);

  const [user_column, setUserColumn] = useState();
  const [user_data, setUserData] = useState();

  const [mobility, setMobility] = useState([]);


  const fetchUser = async () => {
    const response = await axios.get('/api/userCheck');
    const data = response.data;
    
    const processedData = data.map((item, index) => ({
      ...item,
      key: index.toString(),
    }));

    console.log(processedData);
    console.log(data);
    // 컬럼 구조 설정
    const columnStructure = [
      { title: 'user_id ', dataIndex: 'user_id', key: 'user_id' },
      { title: 'Registration_date', dataIndex: 'Registration_date', key: 'Registration_date' },
      { title: 'Phone_number', dataIndex: 'Phone_number', key: 'Phone_number' },
      { title: 'user_name', dataIndex: 'user_name', key: 'user_name' },
      { title: 'user_email', dataIndex: 'user_email', key: 'user_email' },
    ];
    user_setColumns(columnStructure);
    user_setDataSource(processedData);
  };

  const fectchMobility = async (user_id) => {
    try {
      const response = await axios.get(`/api/mobilities?user_id=${user_id}`);
      setMobility(response.data);
    } catch (error) {
      console.error("Error fetching mobility:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const onRowCLick = (record, rowIndex) => {
    return {
      onClick: e => {
        if(record.user_id)
          fectchMobility(record.user_id);
      }
    }
  }
  const onHeaderRowClick = (columns, index) => {
    return {
      onClick: () => { }, // click header row
    };
  }

  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', height: '100%' }}>
          <Table dataSource={user_dataSource} columns={user_columns} onRow={onRowCLick} onHeaderRow={onHeaderRowClick}></Table>
          {/* 화살표 아이콘 */}
          <div style={{ display: "flex", alignItems: "center", margin: "0 100px" }}>
            <ArrowForwardIosIcon />
          </div>
          <div>
          <Card>
          <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {mobility.length > 0 && <Button variant="primary" style={{ margin: '0 auto' }} onClick={() => setPage && setPage("MOBILITY")}> 사용중인 모빌리티 정보</Button>}
            <div style={{ borderBottom: '1px solid #000', paddingBottom: '10px' }}> </div>
            {
              mobility.map((mobility) => (
                <div>
                  <p>모빌리티 ID: {mobility.mobility_id}</p>
                  <p>모빌리티 이름: {mobility.modelName}</p>
                  <p>모빌리티 운영상태: {mobility.operationalStatus}</p>
                  <p>모빌리티 배터리 ID: {mobility.battery_id}</p>
                  <p>모빌리티 총 운행거리: {mobility.total_distance}</p>
                  <p>모빌리티 사용자 ID: {mobility.user_id}</p>
                  <p>모빌리티 배터리 충전량: {mobility.battery_level}</p>
                  <p>총 모빌리티 수: {mobility.total_cnt}</p>
                  <p>사용가능한 모빌리티 수: {mobility.total_cnt - mobility.using_cnt}</p>
                </div>
              ))
            }
          </CardContent>
          </Card>
            
            </div>
        </div>

      </CardContent>
    </Card>
  )
};

export default UsersComponent;
