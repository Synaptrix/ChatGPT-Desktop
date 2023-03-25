/**
 * 获取贡献者列表
 */
export const getContributorsApi = () =>
  request(
    'https://api.github.com/repos/ChatGPT-Desktop/ChatGPT-Desktop/contributors',
    {
      method: 'GET',
      headers: {
        HostUrl: HOST_URL.GITHUB
      }
    }
  )
