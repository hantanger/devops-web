import { deepCopy } from '@/utils/util'

export default function ({ formRef, formData }) {
  // 替换formData
  function setFormData(data) {
    formData.value = deepCopy(data)
  }
  // 修改formData单个属性的值
  function setFormDataItem(key, value) {
    formData.value[key] = value
  }

  // 重置数据与校验
  function resetFields() {
    formRef.value && formRef.value.resetFields()
  }
  return {
    setFormData,
    setFormDataItem,
    resetFields,
  }
}
