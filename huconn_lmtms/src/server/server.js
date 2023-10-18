// server.js 파일

/**
 * 23.08.08 작업후 수정할 사항 : 
 * 
 * 리프레시 토큰 로컬스토리지 저장에 대한 재고
 * 토큰 인증여부에 따른 클라이언트 화면 분리 (사용가능 탭 사용불가 탭 구분)
 * 리프레시 토큰과 액세스토큰의 형태구분 파악 (같은 비밀키 사용 시 같은 값을 가지는 토큰이 생성되는지.... ) --중요. 
 * 
 * 리프레시토큰은 검증시 ( verifyRefreshToken ) 클라이언트로부터 인덱스값을 받아서 데이터베이스에 들어있는 값과 비교할 수 있도록
 * 
 * 
 * 
 */


// 필요한 모듈을 가져옵니다.
const express = require('express');
const http = require('http');
const mysql = require('mysql2');

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
// Express 앱을 생성합니다.
const app = express();
const server = http.createServer(app);

const dbConfig = {
  host: '121.182.60.116',
  user: 'huconn',
  password: '20151216aA!',
  database: 'dhcho',
};

const secretKey = 'your-secret-key';

// Body-parser 미들웨어 설정
app.use(bodyParser.json());

// MySQL 데이터베이스에 연결합니다.
const connection = mysql.createConnection(dbConfig);

// MySQL 데이터베이스 연결을 확인합니다.
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database!');
  }
});

/**-------------------------------------------
 * 토큰 인증방식 ( 액세스 토큰, 리프레시 토큰 )
 * (엑세스토큰은 클라이언트 측, 리프레시 토큰은 서버의 뒤에 위치한 데이터베이스 측)
 * 액세스토큰 만료시 리프레시토큰이 액세스토큰을 다시 재사용가능하게 만든다.
 * 그리고 리프레시 토큰역시 재발급을 가능하게 만든다. (RTR기법)
 * 
 * 아래.... 긴 주석 앞까지...
 * 
 * -------------------------------------------- */

// 로그인 엔드포인트
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const user = results[0];

        // 액세스 토큰 발급
        const accessToken = generateAccessToken({ id: user.id, username: user.username });
        
        // 리프레시 토큰 생성 및 저장
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, secretKey);
        storeRefreshToken(user.id, refreshToken);

        res.json({ accessToken, refreshToken });
      } else {
        res.status(401).json({ error: 'Authentication failed' });
      }
    }
  });
});


// app.post('/api/token', (req, res) => {
//   const refreshToken = req.body.token;

//   // 리프레시 토큰 검증
//   if (refreshToken && refreshTokens[refreshToken]) {
//     jwt.verify(refreshToken, secretKey, (err, user) => {
//       if (err) {
//         return res.status(403).json({ error: 'Invalid refresh token' });
//       }
//       const accessToken = generateAccessToken({ id: user.id, username: user.username });
//       res.json({ accessToken });
//     });
//   } else {
//     res.status(401).json({ error: 'Invalid refresh token' });
//   }
// });

// 액세스 토큰 검증 미들웨어
const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer 토큰을 분리

    jwt.verify(token, secretKey, (err, user) => {
      if (!err) {
        req.user = user; // 유저 정보를 요청 객체에 저장
      }
      next(); // 에러가 없더라도 다음 미들웨어로 진행
    });
  } else {
    next(); // 토큰이 없는 경우도 다음 미들웨어로 진행
  }
};

// const authenticateAccessToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1]; // Bearer 토큰을 분리

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.status(403).json({ error: 'Invalid access token' });
//       }
//       req.user = user; // 유저 정보를 요청 객체에 저장
//       next();
//     });
//   } else {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// 리프레시 토큰 검증 함수
const verifyRefreshToken = (refreshToken, userId, callback) => {
  jwt.verify(refreshToken, secretKey, (err, user) => {
    if (err || user.id !== userId) {
      return callback(err || 'Invalid refresh token');
    }
    callback(null, user);
  });
};

// 리프레시 토큰 저장 함수
const storeRefreshToken = (userId, refreshToken) => {
  const sql = 'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)';
  connection.query(sql, [userId, refreshToken], (error, results) => {
    if (error) {
      console.error('Error storing refresh token:', error);
    } else {
      console.log('Refresh token stored successfully');
    }
  });
};

// 액세스 토큰 발급 함수
function generateAccessToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '15m' }); // 15분 유효
}

// 리프레시 토큰 삭제 함수
const deleteRefreshToken = (refreshToken, callback) => {
  const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
  connection.query(sql, [refreshToken], (error, results) => {
    if (error) {
      console.error('Error deleting refresh token:', error);
      callback(error);
    } else {
      console.log('Refresh token deleted successfully');
      callback(null);
    }
  });
};

// 액세스 토큰 재발급 및 리프레시 토큰 재발급 엔드포인트
app.post('/api/token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const userId = req.body.userId;

  // 리프레시 토큰 검증
  verifyRefreshToken(refreshToken, userId, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // 액세스 토큰 및 리프레시 토큰 재발급
    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    const newRefreshToken = jwt.sign({ id: user.id, username: user.username }, secretKey);
    updateRefreshToken(user.id, refreshToken, newRefreshToken);

    res.json({ accessToken, refreshToken: newRefreshToken });
  });
});

// 액세스 토큰 만료 여부 체크 엔드포인트
app.post('/api/check-token', (req, res) => {
  const accessToken = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ tokenExpired: true });
  }

  jwt.verify(accessToken, secretKey, (err) => {
    if (err) {
      return res.status(401).json({ tokenExpired: true });
    }
    res.json({ tokenExpired: false });
  });
});

// 로그아웃 엔드포인트
app.post('/api/logout', (req, res) => {
  const refreshToken = req.body.refreshToken;

  deleteRefreshToken(refreshToken, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});




// 리프레시 토큰 업데이트 함수
const updateRefreshToken = (userId, oldRefreshToken, newRefreshToken) => {
  const sql = 'UPDATE refresh_tokens SET token = ? WHERE user_id = ? AND token = ?';
  connection.query(sql, [newRefreshToken, userId, oldRefreshToken], (error, results) => {
    if (error) {
      console.error('Error updating refresh token:', error);
    } else {
      console.log('Refresh token updated successfully');
    }
  });
};


/**--------------------------------------------------------------------- */
/**--------------------------------------------------------------------- */
/**--------------------------------------------------------------------- */
/**---------------------------
 * 
 * app.get('/api/stations', authenticateAccessToken, (req, res) => {
  console.log('/api/stations 쿼리수행직전');
  connection.query('SELECT * FROM stations', (error, results) => {
    if (error) {
      console.error('Error fetching stations:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/stations', authenticateAccessToken, (req, res) => {
  console.log('/api/stations 쿼리수행직전');
  connection.query('SELECT * FROM stations', (error, results) => {
    if (error) {
      console.error('Error fetching stations:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

// /api/stations 엔드포인트 ** 23.08.08 최신화 버전
app.get('/api/stations', authenticateAccessToken, (req, res) => {
  console.log('/api/stations 쿼리수행직전');
  connection.query('SELECT * FROM stations', (error, results) => {
    if (error) {
      console.error('Error fetching stations:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});


 * ------------------------------------------ */

////////////////////9월 20일/////////////////////// user부분
app.get('/api/userCheck',(req,res) => {
  console.log("user정보 조회 요청");
  connection.query('SELECT * FROM user',(error, results) => {
    if (error) {
      console.error('Error fetching station:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 정보를 클라이언트에게 응답합니다.
      console.log('쿼리는 날아간듯');
      res.json(results);
    }
  });
});

//배터리부분
//추가예정 진행중 9월 20일 저녁에 진행한것
 app.get('/api/BatStatusCheck',(req,res) => {
   console.log("batStatus정보 조회 요청");
   connection.query('SELECT * FROM battery ',(error, results) => {
    if (error) {
      console.error('Error fetching station:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 스테이션 정보를 클라이언트에게 응답합니다.
      console.log('쿼리는 날아간듯');
      res.json(results);
    }
  });
 })

 // 모빌리티 --> 선택된 모빌리티 정보 --> 선택된 배터리 정보
 app.get('/api/battery/:battery_id', (req, res) => {
  // MySQL 쿼리를 사용하여 스테이션 정보를 가져옵니다.
  console.log("/api/battery 쿼리수행직전");
  const battery_id = parseInt(req.params.battery_id);
  connection.query('SELECT * FROM battery where battery_id = ?', [battery_id], (error, results) => {
    if (error) {
      console.error('Error fetching battery:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 스테이션 정보를 클라이언트에게 응답합니다.
      res.json(results);
    }
  });
});

// 모빌리티 --> 선택된 모빌리티 정보 --> 선택된 사용자 정보
app.get('/api/user/:user_id', (req, res) => {
  // MySQL 쿼리를 사용하여 스테이션 정보를 가져옵니다.
  console.log("/api/user 쿼리수행직전");
  const user_id = req.params.user_id;
  connection.query('SELECT * FROM user where user_id = ?', [user_id], (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 스테이션 정보를 클라이언트에게 응답합니다.
      res.json(results);
    }
  });
});




// API 엔드포인트를 정의합니다.
app.get('/api/station', (req, res) => {
  // MySQL 쿼리를 사용하여 스테이션 정보를 가져옵니다.
  console.log("/api/station 쿼리수행직전");
  connection.query('SELECT * FROM station', (error, results) => {
    if (error) {
      console.error('Error fetching station:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 스테이션 정보를 클라이언트에게 응답합니다.
      console.log('쿼리는 날아간듯');
      res.json(results);
    }
  });
});

// 충전기 정보 조회 API //클릭시
app.get('/api/charger/:station_id', (req, res) => {
  console.log("/api/charger/:station_id 쿼리수행직전");
  const station_id = parseInt(req.params.station_id);
  // MySQL 쿼리를 사용하여 해당 스테이션에 속한 충전기 정보의 charger_id와 operationalStatus 컬럼을 가져옵니다.
  connection.query('SELECT * FROM charger WHERE station_id = ?', [station_id], (error, results) => {
    if (error) {
      console.error('Error fetching charger:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 충전기 정보를 클라이언트에게 응답합니다.
      res.json(results);
    }
  });
});

app.get('/api/mobilities', (req, res) => {
  // MySQL 쿼리를 사용하여 스테이션 정보를 가져옵니다.
  console.log("/api/mobilities 쿼리수행직전");

  const user_id = req.query.user_id;
  const battery_id = parseInt(req.query.battery_id);
  const battery_model = req.query.battery_model;

  const queryResult = (error, results) =>{
    if (error) {
      console.error('Error fetching mobilities:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // 스테이션 정보를 클라이언트에게 응답합니다.
      res.json(results);
    }
  }
  if(user_id)
    connection.query('SELECT * FROM mobility WHERE user_id = ?', [user_id], queryResult);
  else if(battery_id)
    connection.query('SELECT * FROM mobility WHERE battery_id = ?', [battery_id], queryResult);
  else if(battery_model)
  connection.query('SELECT * FROM mobility WHERE battery_id = (SELECT battery_id FROM battery WHERE battery_model = ?)', [battery_model], queryResult);
  else
    connection.query('SELECT * FROM mobility', queryResult);
});

app.get('/api/moblility/:station_id', (req, res) => {
  const station_id = req.params.station_id;
  connection.query('SELECT SUM(total_cnt) AS total_cnt, SUM(using_cnt) AS using_cnt FROM mobility WHERE battery_id IN (SELECT battery_id FROM charger WHERE battery_model IN (SELECT battery_model FROM station WHERE station_id = ?) ) ', [station_id], (error, results) =>{
    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  })
});

// 프론트엔드 개발 서버의 package.json에서 프록시 설정 추가
// "proxy": "http://localhost:4000",

// 서버를 실행합니다.
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
