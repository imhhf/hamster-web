// xx-xx-xx时间格式
const changeTimeDay = (time: number) => {
  // const dt = new Date(new Date(time).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  // console.log('dt',dt);
  let showTime = '';
  const timeObj = Common.formatTime(time);
  const year = timeObj.year;
  const month = timeObj.month >= 10 ? timeObj.month : '0' + timeObj.month;
  const timeday = timeObj.day >= 10 ? timeObj.day : '0' + timeObj.day;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (showTime = year + '-' + month + '-' + timeday);
};
