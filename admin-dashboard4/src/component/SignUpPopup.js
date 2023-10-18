import axios from 'axios';
import React, { useEffect , useState } from 'react';

function SignUpPopup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [passwordEmpty, checkPasswordEmpty] = useState(null);
    const [idDuplicate, checkIdDuplicate] = useState(null);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handlePasswordCheck = () => {
    if(password === "" || confirmPassword === "") {
    setPasswordMatch(true);
    checkPasswordEmpty(true);
        } else {
        const isPasswordMatch = password === confirmPassword;
        setPasswordMatch(isPasswordMatch);
        checkPasswordEmpty(false);
        }
    };

  
    const handleCheckDuplicateId = async ()=> {
      console.log("handleCheckDuplicateId");
        if(username !== "")
        {
            try {
                const response = await axios.post('/check-duplicate-id', {id:username});
                const data = response.data;
                const isDuplicate = data.duplicate;
                if(username!=="") {
                    if(isDuplicate){
                        console.log("중복된 아이디가 존재합니다.");
                        checkIdDuplicate(false);
                    } else {
                        console.log("중복된 아이디가 존재하지 않습니다.");
                        checkIdDuplicate(true);
                    }
                } 
                }catch(error){
                    console.error(error);
            }
        } else {
        checkIdDuplicate(null);
        console.log("아이디 창이 비워져 있습니다.");
        }
    };
    

    const SignUp = async ()=> {
        try {
            const response = await axios.post('/singup', {id:username, password:password});
            const data = response.data;
            const isSignUp = data.singup;
            if(isSignUp) {
                console.log("회원가입이 성공적으로 완료되었습니다.");
                alert("회원가입이 성공적으로 완료되었습니다.");
            } else {
                console.log("회원가입에 실패했습니다.");
                alert("회원가입에 실패했습니다.");
            }
        } catch(error) {
        console.log("회원가입 과정에서 오류가 발생했습니다!");
        alert("회원가입 과정에서 오류가 발생했습니다!");
        }
    };

    useEffect(() => {
      handlePasswordCheck();
      handleCheckDuplicateId();
  },[password, confirmPassword, username]);

    return (
        <div className="popup-container">
      <div className="popup-content">
        <h2>회원가입</h2>
        <form>
          <label>
            아이디:
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          
          {idDuplicate === false && (
            <p className="password-match">아이디가 중복됩니다.</p>
          )}
          {idDuplicate === true && (
            <p className="password-match">사용가능한 아이디입니다.</p>
          )}
          {idDuplicate === null && (
            <p className="password-match">null</p>
          )}

          <br />
          <label>
            비밀번호:
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
          <br />
          <label>
            비밀번호 확인:
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </label>
          <button type="button" onClick={handlePasswordCheck}>
            확인
          </button>
          {passwordMatch === false && (
            <p className="password-match">비밀번호가 일치하지 않습니다.</p>
          )}
          <br />
          <button type="submit" disabled={!passwordMatch || passwordEmpty ||idDuplicate!==true }onClick={SignUp}>
            회원가입
          </button>
        </form>
      </div>
    </div>
        );

}
export default SignUpPopup;
 
