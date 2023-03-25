/**
 * 获取贡献者列表
 */
export const getContributorsApi = async () => {
  return await request('/repos/ChatGPT-Desktop/ChatGPT-Desktop/contributors', {
    method: 'GET',
    headers: {
      HostUrl: HOST_URL.GITHUB
    },
    host: 'GITHUB'
  })
}
