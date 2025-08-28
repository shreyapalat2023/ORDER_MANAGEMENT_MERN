import { Alert, Flex, Spin } from "antd";

const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const Loading = () => (
  <div className="flex justify-center items-center">
    <Flex gap="middle">
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </Flex>
  </div>
);

export default Loading;
