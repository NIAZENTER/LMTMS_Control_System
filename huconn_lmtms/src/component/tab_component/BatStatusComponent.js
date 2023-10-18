import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const BatStatusComponent = ({setPage}) => {
  const [bat_dataSource, bat_setDataSource] = useState([]);
  const [bat_columns, bat_setColumns] = useState([]);

  const [bat_column, setUserColumn] = useState();
  const [bat_data, setUserData] = useState();


  const fetchBat = async () => {
    const response = await axios.get('/api/BatStatusCheck');
    const data = response.data;
    console.log(data);
    const processedData = data.map((item, index) => ({
      ...item,
      key: index.toString(),
    }));

    console.log(processedData);
    console.log(data);
    // 컬럼 구조 설정
    const columnStructure = [
      { title: 'battery_id', dataIndex: 'battery_id', key: 'battery_id' },
      { title: 'battery_Charging', dataIndex: 'battery_charging', key: 'battery_charging' },
      { title: 'battery_Percent', dataIndex: 'battery_percent', key: 'battery_persent' },
      { title: 'battery_Model', dataIndex: 'battery_model', key: 'battery_model' },
      { title: 'battery_Temperature', dataIndex: 'battery_temperature', key: 'battery_temperature'},
    ];
   bat_setColumns(columnStructure);
   bat_setDataSource(processedData);
  };
  
  useEffect(() => {
    fetchBat();
  }, []);

  return <div style={{ display: 'flex', height: '100%' }}>
    <Table dataSource={bat_dataSource} columns={bat_columns}></Table>
  </div>
};

export default BatStatusComponent;
