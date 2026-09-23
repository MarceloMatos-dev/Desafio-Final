import {
  Component
}
from '@angular/core';
import {
  FormsModule
}
from '@angular/forms';
import {
  DataService
}
from '../../core/services/data.service';
import {
  AuthService
}
from '../../core/services/auth.service';
@Component( {
  selector:'app-comunidade',
  imports:[FormsModule],
  templateUrl: './comunidade.component.html',
  styleUrl: './comunidade.component.css'
})
export class ComunidadeComponent {
  text='';
  posts;
  constructor(private d:DataService, public auth:AuthService) {
    this.posts=d.posts()
  }
  publish() {
    const u=this.auth.current();
    if(!u)return;
    this.posts.unshift( {
      id:Date.now(), author:u.name, text:this.text, likes:0, comments:[], created:'Agora'
    });
    this.text='';
    this.d.savePosts(this.posts)
  }
  like(p:any) {
    p.likes++;
    this.d.savePosts(this.posts)
  }
  comment(p:any) {
    const c=prompt('Digite seu comentário:');
    if(c) {
      p.comments.push(c);
      this.d.savePosts(this.posts)
    }
  }
}
