import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Comments }   from '../components/comment-feed/comment-feed.component';

const API_PREFIX = "http://localhost:3001/api";

@Injectable({
  providedIn: "root"
})
export class CommentService {

  constructor(private http: HttpClient) { }

  /**
   * Reset comments back to original state.
   */

  getAllComment()  : Promise<any> {
    return this.http.get(`${API_PREFIX}/comments`).toPromise();  
  }

  findComment(id : number) : Promise<any>  {
    return this.http.get(`${API_PREFIX}/comments/${id}`).toPromise()
  }

  addComment(params : Comments)  : Promise<any>  {
    return this.http.post(`${API_PREFIX}/comments`, params).toPromise()
  }

  resetComments(): Promise<any> {
    return this.http.post(`${API_PREFIX}/reset-comments`, {}).toPromise();
  }
}
