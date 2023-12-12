const Notification = ({ notificationInfo }) => {
  if (notificationInfo.message === null) {
    return null;
  }
  return (
    <div className={notificationInfo.type}>{notificationInfo.message}</div>
  );
};

export default Notification;
