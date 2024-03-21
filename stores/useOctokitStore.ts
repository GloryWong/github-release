import { Octokit } from 'octokit'

export const useOctokitStore = defineStore('octokit', () => {
  const octokit = new Octokit()

  return {
    octokit,
  }
})
