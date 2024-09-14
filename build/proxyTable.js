const proxyUrl = {
  local: "http://127.0.0.1:8080",
  testa: "http://127.0.0.1:8080",
  beta: "http://127.0.0.1:8080",
  online: "http://127.0.0.1:8080",
};

const res = {};

for (let key in proxyUrl) {
  res["/" + key] = {
    target: proxyUrl[key],
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(new RegExp(`^\/${key}`), ""),
  };
}

export default res;
