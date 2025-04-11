interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export const useUserInfo = () => {
  const getUserInfo = (): UserInfo => {
    const storedInfo = localStorage.getItem('userInfo');
    return storedInfo ? JSON.parse(storedInfo) : {
      name: '',
      email: '',
      address: '',
      phone: ''
    };
  };

  const updateUserInfo = (info: Partial<UserInfo>) => {
    const currentInfo = getUserInfo();
    const newInfo = { ...currentInfo, ...info };
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
  };

  return { getUserInfo, updateUserInfo };
};