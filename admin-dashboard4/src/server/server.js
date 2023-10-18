const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const db = require('./config/db.js');
const session_jhpark = require('express-session');
const cookieParser = require('cookie-parser');

const cookieOptions = {
  maxAge:30000,
  httpOnly: true,
};

app.use(session_jhpark({
  secret:'my-secret-key',
  resave: false,
  saveUninitialized: true
}))

// 미들웨어로 등록
app.use(cookieParser());
/* Body Parser 미들웨어 추가 */
app.use(express.json());

// app.use(session_jhpark({
//   secret:'my-secret-key',
//   resave: false,
//   saveUninitialized: true
// }));


// Example API endpoint
app.get('/api/data', (req, res) => {
  // Simulating data retrieval from the database
  const data = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Mike' }
  ];

  res.json(data);
});

app.get('/user', (req, res) => {
  console.log('/유저');
  // const data = [
  //   { id: 1, name: 'John' },
  //   { id: 2, name: 'Jane' },
  //   { id: 3, name: 'Mike' }
  // ];

  // res.json(data);
  console.log("위험해");
  db.query("SELECT * FROM user", (err, data) => {
    if (!err) {
      res.send(data);
      console.log("조회성공");
    }
    else {
      //console.log(err);
      console.log("조회실패");
    }
  })
});
app.get('/mobility', (req, res) => {

  db.query("SELECT * FROM mobility_lmtms", (err, data) => {
    if (!err) {
      res.send(data);
    }
    else {
      console.log(err);
    }
  })
  const id = req.params.id;

});



// 로그인 API 엔드포인트
app.post('/login', (req, res) => {
  const { id, password } = req.body; // POST 요청의 body에서 id와 password 가져오기

  // 로그인 정보를 활용한 MySQL 쿼리 실행
  const query = `SELECT * FROM user WHERE user_id='${id}' AND user_password='${password}'`;
  db.query(query, (err, results) => {
    if (err) {
      console.log('미안한데, 쿼리가 작동이 안되네');
      console.error('쿼리 실행 실패:', err);
      res.status(500).json({ error: '서버 오류' });
    } else {
      if (results.length > 0) {
        // 로그인 성공
        console.log('축하해! 로그인 성공했구나!');
        
        /*
        
        */
       req.session.userId = id;
       
       // 쿠키에 세션 아이디 전달
       res.cookie('sessionId', req.session.id, cookieOptions);
       
       res.json({ message: '로그인 성공' });
        // 로그인 성공했으니까 세션생성하고 세션아이디 줘야합니다.
        // 세션 생성
      } else {
        // 로그인 실패
        res.status(401).json({ error: '로그인 실패' });
        console.log('쿼리는 작동되는데 잘못된 정보를 입력한거야.(없다는 얘기지.) 로그인 실패!');
      }
    }
  });
});

app.post('/check-duplicate-id', (req, res) =>{
  const { id } = req.body;
  const query = `SELECT * FROM user WHERE user_id='${id}'`;
  db.query(query, (err, results) =>{
    if(err) {
      res.status(500).json({ error: '아이디 중복체크 서버오류'});
    } else {
      if(results.length>0){
        console.log(results);
        console.log("아이디가 중복되었어.");
        res.json({duplicate : true});        
      } else{
        console.log("아이디가 중복되지 않았어!");
        res.json({duplicate : false});
      }
    }
  })
})



// check-login API 엔드포인트
app.get('/check-login', (req, res) => {
  console.log("check-login 상태:");
  if (req.session.userId) {
    if (isCookieExpired(req.cookies.sessionId)) {
      // 쿠키의 만료 여부를 확인하여 만료된 경우 로그인 상태 초기화
      req.session.userId = null; // userId 초기화
      res.clearCookie('sessionId'); // 쿠키 제거
      res.json({ loggedIn: false });
      console.log("쿠키가 만료되어 로그인 상태가 아닙니다.");
    } else {
      // 로그인 상태인 경우
      res.json({ loggedIn: true, userId: req.session.userId });
      console.log("로그인 상태가 맞답니다.");
    }
  } else {
    // 로그인 상태가 아닌 경우
    res.json({ loggedIn: false });
    console.log("로그인 상태가 아니랍니다.");
  }
});



//쿠키가 만료되었는지 확인하는 코드
function isCookieExpired(cookieValue) {
  // 쿠키의 만료 여부를 확인하는 로직 작성
  // 예: 현재 시간과 쿠키의 만료 시간을 비교하여 만료되었는지 확인
  // 만료되었다면 true를 반환하고, 그렇지 않으면 false를 반환

  // 여기에서는 예시로 만료되지 않은 상태로 가정합니다.
  return false;
}

app.post('/signup',(req, res) => {
  const {id, password} = req.body;
  const query = `INSERT INTO user {user_id, user_password} VALUES ('${id}','${password})`;

  db.query(query,(err, results) => {
    if(err) {
      console.error('회원가입 쿼리 실행 실패:',err);
      res.status(500).json({error: '서버 오류'});
      console.log('회원가입 쿼리 실행 실패');
    } else {
      console.log('회원가입 성공!');
      res.json({signUp:true});
    }
  });
});


app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
})
//console.log(id);//3

//response,send
//Back to client
//console.log(data);

//const mysql = require('mysql');
// const connection =mysql.createConnection({
//     host:'192.168.0.26',
//     user:'root',
//     password:'0000',
//     database: 'jh-tms'
// });
//connection.connect();


// 코드 휴지통

    //console.log('/mobility/:id')
    //console.log('/mobility/:3')

      //response,send
            //Back to client
      //      console.log(data);


//     connection.query('select * from user',(error,rows) => {
//         if(error) throw error;
//         console.log('USER info is: ',rows);
//     })