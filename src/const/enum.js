// 应用类型
export const appType = {
  1: 'nodejs',
  2: 'tomcat',
  3: 'jar',
  4: 'nginx',
  5: 'python',
}

// 是否支持子环境
export const supportSubEnv = {
  0: '不支持',
  1: '支持',
}

// 模板类型
export const templateType = {
  1: 'dockerfile',
  2: 'yaml',
  // 3: "image",
}

// 环境分支的最近发布状态
export const publishDetailStatus = {
  '-100': '未发布',
  0: '发布中',
  1: '发布成功',
  '-1': '发布失败',
  2: '构建中',
  '-2': '构建失败',
  3: '部署中',
  '-3': '部署失败',
}

export const containerImagePullPolicy = {
  Always: 'Always',
  IfNotPresent: 'IfNotPresent',
  Never: 'Never',
}

export const renewType = {
  0: '延期2周',
  1: '延期1个月',
  2: '延期2个月',
}
