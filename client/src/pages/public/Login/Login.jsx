import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Form, Input, Radio, theme, Typography } from "antd";

import Layout from "~/components/layout/Public/Layout";
// import { jwtDecode } from 'jwt-decode';
// import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { baseURL } from "~/utils";
import { toastSuccess } from "~/components/toast";
import SkeletonPublic from "~/components/loading/SkeletonPublic";

import {
  loginAuth,
  registerAuth,
} from "~/redux/slices/authSlice";

import "./Login.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formLog] = Form.useForm();
  const [formReg] = Form.useForm();
  const [formForgot] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { token: { colorPrimary } } = theme.useToken();

  const navigateBased = (user) => {
    const from = location.state?.from;
    if (from) {
      navigate(from);
      return;
    }

    setTimeout(() => {
      switch (user?.userType) {
        case "admin":
          navigate("/admin");
          break;
        case "user":
          navigate("/user");
          break;
        default:
          navigate("/");
          break;
      }
    }, 500);
  };

  // const handleLoginGoogle = async (credentialResponse) => {
  //     const { user } = await dispatch(loginGoogleAuth(jwtDecode(credentialResponse?.credential))).unwrap();
  //     navigateBased(user);
  //     toastSuccess('auth', "Đăng nhập thành công!", "Chào mừng bạn đến với Chicken War Studio!")
  // };

  const handleLogin = async (values) => {
    const { user } = await dispatch(loginAuth(values)).unwrap();
    navigateBased(user);
    formLog.resetFields();
    toastSuccess(
      "auth",
      "Đăng nhập thành công!",
      "Chào mừng bạn đến với Chicken War Studio!"
    );
  };

  const handleReg = async (values) => {
    await dispatch(registerAuth(values)).unwrap();
    formReg.resetFields();
    toastSuccess(
      "auth",
      "Đăng ký thành công!",
      "Chào mừng bạn đến với Chicken War Studio!"
    );
    navigate("/");
  };

  const handleForgotPassword = async (values) => {
    console.log(values);
  };

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      if (user.userType === 'user') {
        toastSuccess(
          "auth",
          "Chào mừng bạn trở lại!",
          "Hãy học tập thật vui vẽ!"
        );
        navigate("/user");
      } else {
        navigate("/admin");
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonPublic />
      ) : (
        <Layout title="Đăng nhập">
          <div
            className="aris"
            style={{
              background: `url(https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100dvh",
              padding: "0 20px",
            }}
          >
            <div className="form-containet">
              <div
                className="col col-login-1"
                style={{
                  borderRadius: isForgotPassword
                    ? "0 35% 20% 0"
                    : isLogin
                      ? "0 25% 25% 0"
                      : "0 20% 35% 0",
                }}
              >
                <div className="image-layer">
                  <img
                    crossOrigin="anonymous | use-credentials"
                    src={`${baseURL}/login/full-moon.png`}
                    className="form-image-main fi-2"
                  />
                </div>
                <p className="featured-words">
                  Created By <span> Aris </span> <br /> All Rights Reserved
                </p>
              </div>

              <div className="col col-login-2">
                <div
                  className="login-form"
                  style={{
                    opacity: isLogin && !isForgotPassword ? "1" : "0",
                    height: "100%",
                  }}
                >
                  <Typography.Title level={2} style={{ color: colorPrimary }}>ĐĂNG NHẬP</Typography.Title>

                  <div className="form-inputs">
                    <Form
                      form={formLog}
                      name="customFormLo"
                      layout="vertical"
                      onFinish={handleLogin}
                    >
                      <Form.Item
                        label="Email"
                        className="mb-2"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên hoặc email!",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          className="mb-2"
                          placeholder="Nhập tên hoặc email"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Mật khẩu"
                        className="mb-2"
                        name="password"
                        rules={[
                          { required: true, message: "Vui lòng nhập mật khẩu!" },
                        ]}
                      >
                        <Input.Password
                          size="large"
                          className="mb-2"
                          placeholder="Nhập mật khẩu"
                        />
                      </Form.Item>
                    </Form>

                    <div className="forget-pass my-3">
                      <Typography.Text>
                        Chưa có tài khoản?
                        <span onClick={() => setIsLogin(false)}>
                          <Typography.Link className="ms-2" style={{ color: colorPrimary }}>Đăng ký </Typography.Link>
                        </span>
                      </Typography.Text>

                      <Typography.Link onClick={() => setIsForgotPassword(true)} className="ms-2">Quên mật khẩu ?</Typography.Link>
                    </div>

                    <Button size='large' type="primary" className="w-full !mt-4" onClick={() => formLog.submit()} style={{ height: 50 }}>
                      <Typography.Title level={5} className="!mb-0">ĐĂNG NHẬP</Typography.Title>
                    </Button>
                    {/* <Divider plain>Hoặc</Divider> */}

                    <div className="flex justify-center">
                      {/* <GoogleOAuthProvider clientId={inFo?.info?.googleClient || "1081420444654-nndjnesm34tv786257nhgtd5jnc4gns3.apps.googleusercontent.com"}>
                                    <GoogleLogin
                                        onSuccess={handleLoginGoogle}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                    />
                                </GoogleOAuthProvider> */}
                    </div>
                  </div>
                </div>

                <div
                  className="register-form"
                  style={{
                    left: isLogin ? "-50%" : "50%",
                    opacity: isLogin ? "0" : "1",
                  }}
                >
                  <Typography.Title className="my-2" level={2} style={{ color: colorPrimary }}> ĐĂNG KÝ</Typography.Title>
                  <div className="form-inputs">
                    <Form
                      form={formReg}
                      name="customFormReg"
                      layout="vertical"
                      onFinish={handleReg}
                    >
                      <Form.Item
                        label="Họ và tên"
                        className="my-2"
                        name="name"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ và tên!" },
                        ]}
                      >
                        <Input size="large" placeholder="Nhập họ và tên" />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        className="my-2"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                          { type: "email", message: "Email không đúng định dạng!" },
                        ]}
                      >
                        <Input size="large" placeholder="Nhập email" />
                      </Form.Item>

                      <Form.Item
                        label="Số điện thoại"
                        className="my-2"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại!",
                          },
                          {
                            pattern: /^0\d{9}$/,
                            message: "Số điện thoại phải có đúng 10 chữ số!",
                          },
                        ]}
                      >
                        <Input size="large" placeholder="Nhập số điện thoại" />
                      </Form.Item>

                      <Form.Item
                        label="Mật khẩu"
                        className="my-2"
                        name="password"
                        rules={[
                          { required: true, message: "Vui lòng nhập mật khẩu!" },
                        ]}
                      >
                        <Input.Password size="large" placeholder="Nhập mật khẩu" />
                      </Form.Item>

                      <Form.Item
                        layout="horizontal"
                        label="Giới tính"
                        className="gt my-2"
                        name="gender"
                        rules={[{ required: true }]}
                      >
                        <div className="flex justify-end">
                          <Radio.Group>
                            <Radio value="Nam">Nam</Radio>
                            <Radio value="Nữ">Nữ</Radio>
                          </Radio.Group>
                        </div>
                      </Form.Item>
                    </Form>

                    <Button size='large' type="primary" className="w-full" onClick={() => formReg.submit()} style={{ height: 50 }}>
                      <Typography.Title level={5} className="!mb-0">ĐĂNG KÝ</Typography.Title>
                    </Button>
                    <Divider plain>Hoặc</Divider>
                    <div className="forget-pass ad my-3">
                      <div>
                        <span onClick={() => setIsLogin(true)}>
                          <NavLink className="mt-3 link-form" style={{ color: colorPrimary }}> Đăng Nhập</NavLink>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="register-form"
                  style={{
                    left: isForgotPassword ? "50%" : "-50%",
                    opacity: isForgotPassword ? "1" : "0",
                  }}
                >
                  <Typography.Title className="mb-4" level={2} style={{ color: colorPrimary }}> QUÊN MẬT KHẨU</Typography.Title>
                  <div className="form-inputs">
                    <Form
                      form={formForgot}
                      name="forgotForm"
                      layout="vertical"
                      onFinish={handleForgotPassword}
                    >
                      <Form.Item
                        label="Email"
                        className="mb-4"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên hoặc email!",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Nhập tên hoặc email để lấy lại mật khẩu"
                        />
                      </Form.Item>
                    </Form>

                    <Button size='large' type="primary" className="w-full" onClick={() => formForgot.submit()} style={{ height: 50 }}>
                      <Typography.Title level={5} className="!mb-0">ĐẶT LẠI MẬT KHẨU</Typography.Title>
                    </Button>

                    <Divider plain>Hoặc</Divider>
                    <div className="forget-pass my-3 flex !justify-center">
                      <NavLink
                        style={{ color: colorPrimary }}
                        onClick={() => {
                          setIsForgotPassword(false);
                          setIsLogin(true);
                        }}
                        className="link-form"
                      >
                        Đăng Nhập
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default Login;
