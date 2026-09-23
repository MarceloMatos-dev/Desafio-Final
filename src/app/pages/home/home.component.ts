import {
  Component,
  OnDestroy,
  OnInit
}
from '@angular/core';
import {
  RouterLink
}
from '@angular/router';
import {
  DataService
}
from '../../core/services/data.service';
@Component( {
  selector:'app-home',
  imports:[RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,
OnDestroy {
  centers;
  current=0;
  timer:any;
  slides=[ {
    image:'/images/salvador-elevador.svg', alt:'Ilustração de Salvador e do Elevador Lacerda', title:'Solidariedade que conecta Salvador.', text:'Uma plataforma para organizar doações, pontos de apoio e necessidades em situações de emergência na capital baiana.'
  }, {
    image:'/images/pelourinho.svg', alt:'Ilustração do Centro Histórico de Salvador', title:'Cada bairro. Cada necessidade.', text:'Visualize prioridades de abastecimento e direcione recursos para os pontos que mais precisam.'
  }, {
    image:'/images/doacoes.svg', alt:'Ilustração de voluntários organizando doações', title:'Doe o que realmente faz falta.', text:'O ReliefFlow transforma dados de estoque em prioridades simples para doadores, voluntários e organizações.'
  }
  ];
  constructor(private data: DataService) {
    this.centers = data.centers();
  }
  ngOnInit() {
    this.timer=setInterval(()=>this.next(), 5500)
  }
  ngOnDestroy() {
    clearInterval(this.timer)
  }
  next() {
    this.current=(this.current+1)%this.slides.length
  }
  previous() {
    this.current=(this.current-1+this.slides.length)%this.slides.length
  }
  go(i:number) {
    this.current=i
  }
  avg(c: any) {
    return Math.round((
      this.data.percentage(c.water) +
      this.data.percentage(c.food) +
      this.data.percentage(c.hygiene) +
      this.data.percentage(c.medicine) +
      this.data.percentage(c.clothes)
    ) / 5);
  }
  label(n:number) {
    return n<=25?'CRÍTICO':n<=50?'URGENTE':n<=75?'ATENÇÃO':'ESTÁVEL'
  }
  cls(n:number) {
    return n<=50?'critical':n<=75?'warning':'stable'
  }
}
