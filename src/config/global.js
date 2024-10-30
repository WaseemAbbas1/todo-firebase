import { message } from "antd";
export const alertMessage = (type, content) => {
  switch (type) {
    case "error":
      return message.error(content);
    case "success":
      return message.success(content);
    default:
      return message.info("not working");
  }
};
