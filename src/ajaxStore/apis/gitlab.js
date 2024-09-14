export default function (instance) {
  return {
    getBranch: (data, headers) =>
      instance.post('/devopsapi/gitlab/getProjectBranches', data, { headers }),
  }
}
