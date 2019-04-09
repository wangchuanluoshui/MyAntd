import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryUser(params) {
    return request(`/api/user/`);
  }
