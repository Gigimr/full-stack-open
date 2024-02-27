import clases from '../test.module.css';
const Notification = ({ notificationInfo }) => {
  if (notificationInfo.message === null) {
    return null;
  }
  return (
    <div
      className={
        notificationInfo.type === 'success' ? clases.success : clases.error
      }>
      {notificationInfo.message}
    </div>
  );
};

export default Notification;
