import axios from "axios";

// 구글
export const getGoogleUserInfo = async (accessToken) => {
  const res = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // ✅ user info includes: id, email, name, picture
  return res.data;
};

// 카카오
export const getKakaoUserInfo = async (accessToken) => {
  const res = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const kakaoUser = res.data;

  const providerId = kakaoUser.id.toString(); // providerId는 숫자
  const email = kakaoUser.kakao_account?.email || null;
  const nickname = kakaoUser.kakao_account?.profile?.nickname || "KakaoUser";

  return {
    providerId,
    email,
    nickname,
  };
};
