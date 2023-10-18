import React, { useEffect, useState} from 'react';
import { Layout, Menu, Typography, Card, Table, Tabs } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './FirstPage.css';
import BatteryGauge from 'react-battery-gauge';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;

function FirstPage() {
  const [user_dataSource, user_setDataSource] = useState([]);
  const [user_columns, user_setColumns] = useState([]);
  const [mobil_dataSource, mobil_setDataSource] = useState([]);
  const [mobil_columns, mobil_setColumns] = useState([]);

  const [LatData, setLatData] = useState(35.8774721);
  const [LngData, setLngData] = useState(128.6261649);

  const [MarkerLat, setMarkerLat] = useState(LatData);
  const [MarkerLng, setMarkerLng] = useState(LngData);

  /* 5월 24일 추가 코드  */
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  /* 여기까지  */

  const [nowTime, setTime] = useState();

  const [batteryData, setBatteryData] =useState();

  // useEffect (() => {
    
  
  // },[nowTime]);

  const selectUser = async () => {
    console.log("이건 되겠지");
    try {
      console.log("이것도 되겠지");
      const response = await axios.get('/user');
      const data = response.data;
      console.log(data);
      console.log("유저 트라이캐치");
      // 데이터 가공
      const processedData = data.map((item, index) => ({
        ...item,
        key: index.toString(),
      }));
      // 컬럼 구조 설정
      const columnStructure = [
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
        { title: 'Now Use', dataIndex: 'now_use', key: 'now_use' },
        { title: 'Total Use', dataIndex: 'total_use', key: 'total_use' },
      ];
      // 데이터와 컬럼 업데이트
      user_setDataSource(processedData);
      user_setColumns(columnStructure);
    } catch (error) {
      console.error(error);
    }
  };
  const selectMobil = async () => {
    try {
      const response = await axios.get('/mobility');
      console.log("모빌리티 조회시도.");
      const data = response.data;
      console.log(data);

      // 데이터 가공
      const processedData = data.map((item, index) => ({
        ...item,
        key: index.toString(),
      }));

      // 컬럼 구조 설정
      const columnStructure = [
        { title: 'Model ID', dataIndex: 'model_id', key: 'model_id' },
        { title: 'Model Type', dataIndex:'model_type', key: 'model_type' },
        { title: 'Total run', dataIndex: 'total_run', key: 'total_run' },
        { title: 'Today run', dataIndex: 'today_run', key: 'today_use' },
        { title: 'Battery percent', dataIndex: 'battery_percent', key: 'battery_percent' },
      ];

      // 데이터와 컬럼 업데이트
      mobil_setDataSource(processedData);
      mobil_setColumns(columnStructure);
    } catch (error) {
      console.error(error);
    }
  };


  const [activeTab, setActiveTab] = useState("1");
  const [activeTab2, setActiveTab2] = useState("1");
  const [activeTab3, setActiveTab3] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleTabChange2 = (key) => {
    setActiveTab2(key);
  };

  const handleTabChange3 = (key) => {
    setActiveTab3(key);
  };

  const handleHomeClick = () => {
    setActiveTab("1");
  };

  const currentTime = moment().format('YYYY년 MM월 DD일 HH:mm');

  //////////////////////////////////////////////////////
  // 로그인 관련 함수들
  const checkLoggedIn = async () => {
    console.log("새로고침 시도1");
    try {
      console.log("리스폰스 전");
      // 쿠키를 포함한 요청을 보내서 로그인 상태 확인
      const response = await axios.get('/check-login', { withCredentials: true });
      console.log("새로고침 시도2");

      console.log(response.data);
      
      if (response.data.loggedIn) {
        // 로그인 상태인 경우 userId 설정
        setLoggedIn(true);
        setUserId(response.data.userId);
        console.log("새로고침 성공인데");
        // alert("새로고침 성공");
        
      } else {
        // 로그인 상태가 아닌 경우 userId 초기화
        setLoggedIn(false);
        setUserId('');
        console.log("새로고침 실패");
      }
    } catch (error) {
      console.log("그냥 에러만 난거야");
      console.error(error);
    }
  };

  const handleLogin = async () => {
    const loginId = document.getElementById('login_id').value;
    const loginPassword = document.getElementById('login_password').value;

    alert(loginId);

    // 데이터를 서버로 전달하고 응답을 받기 위해 axios 사용
    try {
      const response = await axios.post('/login', { id: loginId, password: loginPassword });
      console.log(response.data);
      
        // 로그인 성공 시 userId 설정
        setLoggedIn(true);
        setUserId(loginId);
        alert("로그인성공");
       
    } catch (error) {
      // 로그인 실패한 경우에 대한 처리
      console.error(error);
      alert("실패지롱");
    }
  };

  const handleLogout = () =>{
    setLoggedIn(false);
    setUserId(null);
    alert("로그아웃");
  }

    //스크립트 파일 읽어오기
    const new_script = src => { 
      return new Promise((resolve, reject) => { 
        const script = document.createElement('script'); 
        script.src = src; 
        script.addEventListener('load', () => { 
          resolve(); 
        }); 
        script.addEventListener('error', e => { 
          reject(e); 
        }); 
        document.head.appendChild(script); 
      }); 
    };
///////////////////////////////////MapMarker 표시////////
const MarkerLatLng = () => {
  var lat = document.getElementById("marker_lat").value;
  var lng = document.getElementById("marker_lng").value;
  if (!isNaN(lat) && !isNaN(lng)) {
    // alert("일단 둘다 괜찮아");
    setMarkerLat(lat);
    setMarkerLng(lng);
  } 
  // const marker = new MapMarker.document.getElementById("newMarker");
  // marker(lat, lng);
}


const customLatLng = () => {
  var lat = document.getElementById("textarea_lat").value;
  var lng = document.getElementById("textarea_lng").value;

  if (!isNaN(lat) && !isNaN(lng)) {
    setLatData(lat);
    setLngData(lng);
  } 
}


const openSignUpPopup = () => {
    const popupWindow = window.open('./signin', 'SignUpPopup', 'width=500,height=500');
}
///////////////////////////////////MapMarker 표시////////

const fetchBatteryData = async() => {
  try{
    const response = await axios.post('/batteryCheck');
    const data = response.data;
    console.log(data);

    const processedData = data.map((item, index) => ({
      ...item,
      key:index.toString(),
    }));

    const batteryTabelData = data.map((battery)=> ({
      batteryId: battery.battery_id,
      batteryChargin: battery.battery_charging,
      batteryPercent: battery.battery_percent,
    }));

    setBatteryData(processedData);
  }catch(error){
    console.log(error);
  }

}



useEffect(() => {
  selectUser();
  selectMobil();
  checkLoggedIn();

  console.log(user_dataSource);
  console.log(user_columns);
  // alert(MarkerLat);
  // alert(MarkerLng);
},[]); 

  return (
    <Layout>
      <Sider width={"20%"} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="0" onClick={handleHomeClick}>Home</Menu.Item>
          {/* */}
          <Content style={{ margin: '24px 16px 0' }}>
            <Card title="Mobility Model" style={{ width: '100%' }} className="scrollable-content">
              <Tabs activeKey={activeTab} onChange={handleTabChange} >
                <TabPane tab="Tab 1" key="1">
                  <Table dataSource={mobil_dataSource} columns={mobil_columns} />
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                 {/* */}                
                </TabPane>
              </Tabs>
            </Card>
          </Content>
          <Content style={{ margin: '24px 16px 0' }}>
            <Card title="User" style={{ width: '100%' }} className="scrollable-content">
              <Tabs activeKey={activeTab2} onChange={handleTabChange2} >
                <TabPane tab="Tab 1" key="1">
                  <Table dataSource={mobil_dataSource} columns={mobil_columns} />
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                  {/* 다른 내용을 추가하세요 */}
                </TabPane>
              </Tabs>
            </Card>
          </Content>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#ffd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '5px' }}>
            <Text strong>{currentTime}</Text>
            <Text strong>LM_TMS</Text>
            <Text strong>{currentTime}</Text>

            {!loggedIn && (
            <>
              <h1>ID :</h1>
              <input id="login_id"></input>
              <h1>PASSWORD :</h1>
              <input type="password" id="login_password"></input>
              <button onClick={handleLogin}>로그인</button>
            </>
            )}

           
          {loggedIn && (
            <>
              <h1>Logged in as:</h1>
              <Text>{userId}</Text>
              {/* 여기에 로그인 후에 보여주고 싶은 내용을 추가하세요 */}
              <button onClick={handleLogout}>로그아웃</button>
            </>
          )}
         

            {!loggedIn && (          
              <button onClick={openSignUpPopup}>회원가입</button>            
            )} 
           
            {/* <h1>ID :</h1>
            <textarea id="login_id"></textarea>                           
            <h1>PASSWORD : </h1>
            <textarea id="login_password"></textarea>
            <button onClick={handleLogin}>로그인</button>     */}

          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <Card title="Table" style={{ width: '100%' }} >
            <Tabs activeKey={activeTab3} onChange={handleTabChange3} >
              <TabPane tab="Tab 1" key="1">
                <Table dataSource={user_dataSource} columns={user_columns} />
                <h1>배터리 확인</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '5%' }}>
      {/* {batteryData.map((battery, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <BatteryGauge
            value={battery.battery_percent}
            size={200}
            aspectRatio={0.3}
            animated={false}
          />
          <br />
          <label style={{ marginTop: '10px' }}>Battery ID: {battery.battery_id}</label>
          <br />
          <label style={{ marginTop: '10px' }}>Battery ID: {battery.battery_id}</label>
          <br />
          <button style={{ marginTop: '10px' }}>Charge</button>
        </div>
      ))} */}
    </div>
              </TabPane>
              <TabPane tab="Tab 2" key="2">
                <div>
                  {/* 지도 자리! */}
                  
                  <Map 
                      center={{ lat: LatData, lng: LngData }}   // 지도의 중심 좌표
                      style={{ width: '800px', height: '600px' }} // 지도 크기
                      level={3}                                   // 지도 확대 레벨
                      >
                      <MapMarker position={{ lat: MarkerLat, lng: MarkerLng }}></MapMarker>
                      
                      {/* <MapMarker id="newMarker" position={{ lat: MarkerLat, lng: MarkerLng }}></MapMarker> */}
                  </Map>
                  {/* 이 위까지가 지도 */}
                  <button onClick={customLatLng}>위치조회</button>            
                  <div id="mobility"></div>
                  <h1>지도 위도</h1>
                  <textarea id="textarea_lat"></textarea>                           
                  <h1>지도 경도</h1>
                  <textarea id="textarea_lng"></textarea>
                  <br></br>
                  <br></br>
                  {/*마커 찍기 */}
                  <button onClick={MarkerLatLng}>마커표시</button>            
                  <h1>마커 위도</h1>
                  <textarea id="marker_lat"></textarea>                           
                  <h1>마커 경도</h1>
                  <textarea id="marker_lng"></textarea>
                  </div>                                         
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
    </Layout>
    
  );
}


export default FirstPage;

// setLatData(document.getElementById("textarea_lat").innerText)
// setLngData(document.getElementById("textarea_lng").innerText)

/*함수 밖에서 선언되던 내가 정한 것들 이제는 안녕~
const dataSource = [
  { key: '1', name: 'John', age: 30, address: 'New York' },
  { key: '2', name: 'Jane', age: 25, address: 'London' },
  { key: '3', name: 'Mike', age: 40, address: 'Sydney' },
];
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

*/


 /* 화면에 넣을 방법 고민중
   console.log(data);
   const dataSource = [
    data
  ];

  const columns = [
    { title: 'User_Id', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Now_use', dataIndex: 'now_use', key: 'now_use' },
    { title: 'Total_use', dataIndex: 'total_use', key: 'total_use' },
  ];
   
   */

/* 이 밑은 다 사용하지 않는 주석 */

//ES6 -template string,arrow-fuction,async

  // const result = await axios.get('/mobility/'+3)


//axios 모듈에서axios함수를 불러온다. ($.ajax랑 거의 같다 보면된다.)
//axios ㅆ는 목적, 서버에 데이터를 요청할때 비동기적으로 요청하려고

//import { response } from 'express';
//import mysql from 'mysql';
//import axios from "axios"

//const { SubMenu } = Menu;

//const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: '192.168.9.87',
//   user: 'root',
//   password: '0000',
//   database: 'jh-tms'
// });

// connection.connect((err) => {
//   if (err) {
//     console.log('Error connecting to Mysql database: ' + err.stack);
//     return;
//   }
//   console.log('Connected to Mysql database!');
// });

// useEffect(() => {
  //   fetch('http://192.168.8.121:3500/api/data')
  //     .then(response => response.json())
  //     .then(data => {
  //       setUsers(data);
  //       console.log("1234567");
  //     })
  //     .catch(error => {
  //       console.error('API request error:', error);
  //     });
  // }, []);



  // const callApi = async () => {
  // axios.get("/api").then((res) => console.log(res.data.test));
  // }
  
// useEffect(() => {
//   callApi();
// },[])


// const data = result.data;
      // console.log(data);
      // console.log("제대로 되야할텐데");
      // mobility_data = data
      // console.log(mobility_data);

      // const [users, setUsers] = useState([]);
  // var mobility_data = [];
  // document.getElementById("mobility").innerText = user_data[1].model_id.toString();


   /*
  이 친구들은 밖에서 선언되어 누군가의 호출이 있어야지만 움직이던 그런,
  수동적인 친구들이었지....
  
  selectUser도 여기에 안녕
  const selectUser = () => {
   alert("User choice!")
   const result = axios.get('/user')
    console.log(result);
    
  }



  selectMobil 잠시만 여기에 
  
  const selectMobil = async() => {
    //alert("Mobil Choice!")
    const mobil_result =
    axios.get('/mobility/'+3)
    .then(response =>{
      const mob_data =response.data;
      console.log(response);
      console.log(mob_data);
      setData(response.data);



      const result = document.getElementById("mobility").innerText = mob_data[count].model_id.toString();
      //result = document.getElementById("mobility").innerText = mob_data[0].model_id.toString();
      document.getElementById(`mobility${2}`).innerText = mob_data[1].model_id.toString();

      count++;
      document.getElementById(`mobility${count+2}`).innerText = mob_data[count+1].model_id.toString();
      
      console.log(count);


    })
    .catch(error => {
      // 오류 처리
      console.error(error);
    });
   }
  
  */

   /* 이 코드는 useEffect가 호출될 때에 빈 TEXT문을 채워주는 용도로 사용이 되었습니다.
   그것을 확인하는 용도로만 사용되었음을 알립니다.

   const selectMobil = async () => {
    try {
      const response = await axios.get('/mobility/3');
      const mob_data = response.data;
      console.log(response);
      console.log(mob_data);
      setData(response.data);
      document.getElementById("mobility").innerText = mob_data[count].model_id.toString();
      count++;
      document.getElementById("mobility2").innerText = mob_data[count].model_id.toString();
      count++;
      document.getElementById("mobility3").innerText = mob_data[count].model_id.toString();
    
    } catch (error) {
      // 오류 처리
      console.error(error);
    }
  };

   */




  /*
  계속 실행되는거 한번만 하게 하려고 합니다. 그런데 그 방법을 다시 고려해봐야 할것 같습니다.
  var count = 0;
  if(count == 0){
    document.addEventListener("DOMContentLoaded",selectMobil());
   count++;
   }
  */