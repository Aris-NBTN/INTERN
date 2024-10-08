import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Form, Input, Modal, Radio, Steps, theme, Typography } from "antd";
import Layout from "~/components/layout/Public/Layout";
import { jwtDecode } from 'jwt-decode';

import { baseURL, forgotPass } from "~/utils";
import { toastError, toastLoading, toastSuccess } from "~/components/toast";
import SkeletonPublic from "~/components/loading/SkeletonPublic";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { loginAuth, loginGoogleAuth, registerAuth, } from "~/redux/slices/authSlice";

import "./Login.css";
import { IoIosSend } from "react-icons/io";
import { emailApi } from "~/apis/emailAPi";
import { userApi } from "~/apis/userApi";
import { getInfoApi } from "~/redux/slices/Data/infoSlice";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formLog] = Form.useForm();
  const [formLogGoogle] = Form.useForm();
  const [formReg] = Form.useForm();
  const [formForgot] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const [openForgot, setOpenForgot] = useState(false);
  const [currentForgot, setCurrentForgot] = useState(0);
  const [openFormAddUser, setOpenFormAddUser] = useState(false);

  const [otp, setOtp] = useState();
  const [passWord, setPassWord] = useState();
  const [confirmPass, setConfirmPass] = useState()
  const { info, loadingL: loadingInfo } = useSelector(state => state.info);

  const { darkMode } = useSelector((state) => state.theme);

  const { user } = useSelector((state) => state.auth);
  const { token: { colorPrimary } } = theme.useToken();

  const navigateBased = (user) => {
    const from = location.state?.from;
    toastSuccess(
      "auth",
      "Đăng nhập thành công!",
      `Chào mừng bạn đến với ${info?.newData?.[0].name || "Chicken War Studio!"}`
    );

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
          // navigate("/");
          break;
      }
    }, 500);
  };

  const handleLogin = async (values) => {
    const user = await dispatch(loginAuth(values)).unwrap();
    navigateBased(user);
    formLog.resetFields();
  };

  const handleCheckUser = async (credentialResponse) => {
    const dataUser = jwtDecode(credentialResponse?.credential);
    try {
      toastLoading('auth', 'Đang xác thực tài khoản...');
      const res = await userApi.checkEmail({ email: dataUser.email });
      if (res.exists) {
        const { user } = await dispatch(loginGoogleAuth({ email: dataUser.email, jtiNew: dataUser.jti, jti: res.jti })).unwrap();
        navigateBased(user);
      } else {
        setOpenFormAddUser(true);
        formLogGoogle.setFieldsValue({ email: dataUser.email, name: dataUser.name, jti: dataUser.jti, avatar: dataUser.picture });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleReg = async (values) => {
    await dispatch(registerAuth(values)).unwrap();
    formReg.resetFields();
    toastSuccess(
      "auth",
      "Đăng ký thành công!",
      `Chào mừng bạn đến với ${info?.newData?.[0].name || "Chicken War Studio!"}`
    );
    navigate("/");
  };

  const handleForgotPassword = async (values) => {
    setOpenForgot(true);
    const res = await userApi.checkEmail(values);
    if (res.exists) {
      setCurrentForgot(currentForgot + 1);
      emailApi
        .sig({ id: forgotPass })
        .then((res) => {
          emailApi.sendForgot({ email: values.email, title: "Mã xác nhận", content: res.content })
        })
    } else {
      toastError('auth', 'Email không tồn tại!', 'Vui lòng kiểm tra lại email của bạn!');
    }
  };

  const handleOtp = () => {
    userApi
      .checkCode({ email: formForgot.getFieldValue('email'), verify: otp })
      .then((res) => {
        if (res.exists) {
          setCurrentForgot(currentForgot + 1);
        } else {
          toastError('auth', 'Mã xác nhận không đúng!', 'Vui lòng kiểm tra lại mã xác nhận của bạn!');
        }
      })
  };

  const handleChangePass = () => {
    const date = new Date();
    toastLoading(date, 'Đang đổi mật khẩu');
    if (passWord === confirmPass) {
      userApi
        .putUserForgot({ email: formForgot.getFieldValue('email'), password: passWord, verify: otp })
        .then((res) => {
          if (res) {
            toastSuccess(date, 'Đổi mật khẩu thành công!', 'Hãy đăng nhập để trải nghiệm tốt nhất!');
            setOpenForgot(false);
          }
        })
    } else {
      toastError(date, 'Mật khẩu không trùng khớp!', 'Vui lòng kiểm tra lại mật khẩu của bạn!');
    }
  };

  const steps = [
    {
      key: '1',
      title: 'Xác nhận thông tin',
      content: <>
        <Form
          className="mt-4"
          form={formForgot}
          name="formForgotPass"
          layout="vertical"
          onFinish={handleForgotPassword}
        >
          <Form.Item
            label="Email"
            className="mb-4"
            name="email"
            validateFirst
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập email để lấy lại mật khẩu"
            />
          </Form.Item>
        </Form>
      </>,
    },
    {
      key: '2',
      title: 'Điền mã xác nhận',
      content: <>

        <Form
          className="mt-4"
          name="sdfsdfsdfsdfsdfsdf"
          layout="vertical"
          onFinish={handleOtp}
        >
          <Form.Item
            label="Nhập mã xác nhận gửi về email bao gồm 6 chữ số"
            className="mb-4 flex flex-col justify-center items-center flex-wrap"
            name="otp"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã xác nhận!",
              },
            ]}
          >
            <Input.OTP
              onChange={(e) => setOtp(e)}
              size="large"
              placeholder="Nhập mã xác nhận"
            />
          </Form.Item>

          <div className="flex justify-center gap-2">
            <span>Không thấy mã <Button icon={<IoIosSend />} style={{ color: colorPrimary }} type="text">Gửi lại mã</Button></span>
          </div>
        </Form>
      </>,
    },
    {
      key: '3',
      title: 'Đặt lại mật khẩu',
      content: <>
        <Form
          className="mt-4"
          name="adssdfsdfsdf"
          layout="vertical"
          onFinish={handleChangePass}
        >
          <Form.Item
            label="Mật khẩu mới"
            className="mb-4"
            name="password"
            validateFirst
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự!",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setPassWord(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            className="mb-4"
            name="confirmPassword"
            validateFirst
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự!",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </Form.Item>
        </Form>
      </>,
    },
  ];

  useEffect(() => {
    if (loading) {
      dispatch(getInfoApi());
    }
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      if (user.userType === 'user') {
        navigate("/user");
      } else {
        navigate("/admin");
      }
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  return (
    <>
      {loading ? (
        <SkeletonPublic />
      ) : (
        <Layout title="Đăng nhập">
          <div
            className="aris"
            style={{
              background: `url(https://media.istockphoto.com/id/1283852667/vi/anh/ch%E1%BA%A1m-v%C3%A0o-r%C3%AAu-t%C6%B0%C6%A1i-trong-r%E1%BB%ABng.jpg?s=612x612&w=0&k=20&c=1NAbpO5PSxYA4FzHdRrd4zODtLni9pzNUtwx3zHYfwU=)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100dvh",
              padding: "0 10px",
            }}
          >
            <div className="form-containet">
              <div
                className="col col-login-1"
                style={{
                  borderRadius:
                    isLogin
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

                <Typography.Title className="featured-words" level={5}> Created By
                  <Typography.Link className="ms-1">Aris</Typography.Link>
                  <br /> All Rights Reserved
                </Typography.Title>
              </div>

              <div className="col col-login-2">
                <div
                  className="login-form"
                  style={{
                    opacity: isLogin ? "1" : "0",
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
                        validateFirst
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                          { type: "email", message: "Email không đúng định dạng!" },
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
                        validateFirst
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                          {
                            min: 8,
                            message: "Mật khẩu phải có ít nhất 8 ký tự!",
                          },
                          {
                            pattern: /[!@#$%^&*(),.?":{}|<>]/,
                            message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                          },
                        ]}
                      >
                        <Input.Password
                          size="large"
                          className="mb-2"
                          placeholder="Nhập mật khẩu"
                        />
                      </Form.Item>
                    </Form>

                    <div className="forget-pass my-2">
                      <Typography.Text>
                        Chưa có tài khoản?
                        <span onClick={() => setIsLogin(false)}>
                          <Typography.Link className="ms-2" style={{ color: colorPrimary }}>Đăng ký </Typography.Link>
                        </span>
                      </Typography.Text>

                      <Typography.Link onClick={() => setOpenForgot(true)} className="ms-2">Quên mật khẩu ?</Typography.Link>
                    </div>

                    <Button size='large' type="primary" className="w-full !mt-2" onClick={() => formLog.submit()} style={{ height: 50 }}>
                      <Typography.Title level={5} className="!mb-0">ĐĂNG NHẬP</Typography.Title>
                    </Button>
                    <Divider plain>Hoặc</Divider>

                    <div className="flex justify-center items-center">
                      <GoogleOAuthProvider clientId={"1081420444654-nndjnesm34tv786257nhgtd5jnc4gns3.apps.googleusercontent.com"}>
                        <GoogleLogin
                          size="large"
                          theme={darkMode ? 'filled_black' : 'filled_white'}
                          shape="rectangular"
                          width={300}
                          onSuccess={handleCheckUser}
                          onError={() => {
                            console.log('Login Failed');
                          }}
                        />
                      </GoogleOAuthProvider>
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
                  <Typography.Title className="!mb-0" level={2} style={{ color: colorPrimary }}> ĐĂNG KÝ</Typography.Title>
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
                        validateFirst
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
                        validateFirst
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại!",
                          },
                          {
                            pattern: /^0/,
                            message: "Số điện thoại phải bắt đầu bằng số 0!",
                          },
                          {
                            len: 10,
                            message: "Số điện thoại phải có đúng 10 số!",
                          },
                        ]}
                      >
                        <Input size="large" placeholder="Nhập số điện thoại" />
                      </Form.Item>

                      <Form.Item
                        label="Mật khẩu"
                        className="my-2"
                        name="password"
                        validateFirst
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                          {
                            min: 8,
                            message: "Mật khẩu phải có ít nhất 8 ký tự!",
                          },
                          {
                            pattern: /[!@#$%^&*(),.?":{}|<>]/,
                            message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                          },
                        ]}
                      >
                        <Input.Password size="large" placeholder="Nhập mật khẩu" />
                      </Form.Item>

                      <Form.Item
                        layout="horizontal"
                        className="mt-2 !mb-0"
                        name="gender"
                        rules={[
                          { required: true, message: "Vui lòng chọn giới tính!" },
                        ]}
                      >
                        <div className="flex justify-between">
                          <Typography.Text>Giới tính:</Typography.Text>
                          <Radio.Group>
                            <Radio value="Nam">Nam</Radio>
                            <Radio value="Nữ">Nữ</Radio>
                          </Radio.Group>
                        </div>
                      </Form.Item>
                    </Form>

                    <Button size='large' type="primary" className="w-full mt-2" onClick={() => formReg.submit()} style={{ height: 50 }}>
                      <Typography.Title level={5} className="!mb-0">ĐĂNG KÝ</Typography.Title>
                    </Button>

                    <Divider plain>Hoặc</Divider>

                    <div className="my-3 flex justify-center">
                      <Button onClick={() => setIsLogin(true)} size="large" type="text">
                        <Typography.Text className="!mb-0" style={{ color: colorPrimary }}> Đăng Nhập</Typography.Text>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal
            title="Quên mật khẩu"
            centered
            open={openForgot}
            onOk={() => setOpenForgot(false)}
            onCancel={() => setOpenForgot(false)}
            footer={null}
            width={650}
          >
            <Steps current={currentForgot} items={steps} />
            <div>{steps[currentForgot].content}</div>
            <div
              className="flex justify-end"
              style={{
                marginTop: 24,
              }}
            >

              {currentForgot > 0 && (
                <Button
                  style={{
                    margin: '0 8px',
                  }}
                  onClick={() => setCurrentForgot(currentForgot - 1)}
                >
                  Trở Lại
                </Button>
              )}

              {currentForgot == 0 && (
                <Button type="primary" onClick={() => formForgot.submit()}> Gửi Email Xác Nhận</Button>
              )}

              {currentForgot == 1 && (
                <Button type="primary" onClick={handleOtp}>Xác Nhận</Button>
              )}

              {currentForgot === steps.length - 1 && (
                <Button type="primary" onClick={handleChangePass}> Đặt Lại Mật Khẩu </Button>
              )}
            </div>
          </Modal>

          <Modal
            title="Tạo Tài Khoản Mới"
            maskClosable={false}
            centered
            open={openFormAddUser}
            onOk={() => formLogGoogle.submit()}
            onCancel={() => setOpenFormAddUser(false)}
            width={600}
          >
            <Typography>Đây là lần đầu bạn đăng nhập nên hãy thêm mật khẩu và số điện thoại cho chúng tôi!</Typography>
            <Form
              className="mt-4"
              form={formLogGoogle}
              name="forgotForm"
              layout="vertical"
              onFinish={handleReg}
            >
              <Form.Item
                className="my-2 hidden"
                name="jti"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                className="my-2 hidden"
                name="avatar"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Họ và tên"
                className="mb-4"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nhập tên"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                className="mb-4"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  readOnly={true}
                  placeholder="Nhập tên hoặc email để lấy lại mật khẩu"
                />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                className="my-2"
                name="phone"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: /^0/,
                    message: "Số điện thoại phải bắt đầu bằng số 0!",
                  },
                  {
                    len: 10,
                    message: "Số điện thoại phải có đúng 10 số!",
                  },
                ]}
              >
                <Input size="large" placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                className="mb-4"
                name="password"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                  {
                    min: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự!",
                  },
                  {
                    pattern: /[!@#$%^&*(),.?":{}|<>]/,
                    message: "Mật khẩu phải có ít nhất một ký tự đặc biệt!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>

              <Form.Item
                layout="horizontal"
                className="mt-2 !mb-0"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <div className="flex justify-between">
                  <Typography.Text>Giới tính:</Typography.Text>
                  <Radio.Group>
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                  </Radio.Group>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      )}
    </>
  );
};

export default Login;
