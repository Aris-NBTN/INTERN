import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Layout from '~/components/layout/Public/Layout';
import SkeletonPublic from '~/components/loading/SkeletonPublic';

import { pagesApi } from '~/apis/pagesApi';
import { Result } from 'antd';

const Html = () => {
  const { '*': path } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/") {
      pagesApi.sig("trang-chu")
        .then(page => {
          setPage(page);
          setLoading(false);
        })
        .catch(() => {
          navigate('/404');
        });
    } else {
      pagesApi.sig(path, 'page')
        .then(page => {
          setPage(page);
          setLoading(false);
        })
        .catch(() => {
          navigate('/404');
        });
    }
  }, [path]);

  useEffect(() => {
    const existingStyle = document.getElementById('dynamic-styles');
    if (existingStyle) existingStyle.remove();

    const existingScript = document.getElementById('dynamic-script');
    if (existingScript) existingScript.remove();

    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-styles';
    styleElement.innerHTML = page?.content?.css;
    document.head.appendChild(styleElement);

    const scriptElement = document.createElement('script');
    scriptElement.id = 'dynamic-script';
    scriptElement.innerHTML = page?.content?.js;
    document.body.appendChild(scriptElement);
    return () => {
      styleElement.remove();
      scriptElement.remove();
    };

  }, [page]);

  return (
    <Layout
      title={page?.name || "Chicken War Studio"}
      description={page?.description || "Chicken War Studio"}
      keywords={page?.keywords || "Chicken War Studio"}
    >
      {loading ? (
        <SkeletonPublic />
      ) : !page?.content ? (
        <section>
          <Result
            status="403"
            title="Không có dữ liệu!"
            subTitle="Trang chưa được thêm dữ liệu vào trong, vui lòng thêm dữ liệu vào!"
          />
        </section>
      ) : (
        <div
          id="page-content"
          dangerouslySetInnerHTML={{ __html: page?.content?.html }}
        />
      )}
    </Layout>
  );
}
export default Html;
