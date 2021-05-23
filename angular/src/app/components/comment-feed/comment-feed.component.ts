import { Component, OnInit } from "@angular/core";
import { CommentService } from "./../../services/comment.service";

export interface Comments {
  id    : number,
  text  : string
}

@Component({
  selector: "app-comment-feed",
  templateUrl: "./comment-feed.component.html",
  styleUrls: ["./comment-feed.component.css"]
})
export class CommentFeedComponent implements OnInit {
  
  comments  : Comments[]  = []
  newComm   : string      = ''

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.getAllComments()
  }

  async find(event) {
    const resp = await this.commentService.findComment(event.target.value)
    this.comments = resp.data
  }

  async search(event)  {
    return
  }

  newComment(event) {
    this.newComm  = event.target.value
  }

  async addComment() {
    const params  : Comments  = {
      text  : this.newComm,
      id    : this.comments.length + 1
    }
    const resp = await this.commentService.addComment(params)
  }

  async getAllComments()  {
    const resp = await this.commentService.getAllComment()
    this.comments = resp.data
  }

  async resetCommentFeed() {
    this.commentService.resetComments()
  }
}
