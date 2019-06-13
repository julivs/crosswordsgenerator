

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var jogo = {

	tentativas: 0,
	
	inicia: function(){
	  this.termosBrutos = palavras;
	  this.termos = [];
	  this.descricao = [];
	  this.usados = (new Array(palavras.length)).fill(0);
	  this.posicaoTermos = (new Array(palavras.length)).fill(['','']);
	  this.gradeSize = 0;
	  this.maxArea = 0;
	  this.inicioBusca =  1;
	  this.limites =  [999, 999, 0, 0];
	  this.grade =  [];
	  this.gradeDirecao = [];
	  this.tamRestrito = document.getElementById('restrito').checked;
	  
	var maior = 0;
    var itens = this.termos;
	
	this.termosBrutos = shuffle(this.termosBrutos);
	
	this.termosBrutos.forEach(function(value){
	
		var t2 = value.split("::");
		t2[0] = t2[0].replace(/\s/g,"");
		jogo.termos.push(t2[0]);
		jogo.descricao.push(t2[1]);
	});
    
	/*
    this.termos.sort(function(a,b){
      if (a.length > b.length) return -1;
      else if (a.length == b.length) return 0;
      else return 1;
    });
	*/
    
    this.gradeSize = 15 * this.termos.length;
	this.maxArea = parseInt(Math.sqrt(this.gradeSize)) + 5;
	console.log(this.maxArea);

	this.preencherGrade();
    
  },

  preencherGrade: function(){
  
    this.grade = new Array(this.gradeSize);
    this.gradeDirecao = new Array(this.gradeSize);
	
	for (var i = 0; i < this.gradeSize; i ++){
	
		this.grade[i] = new Array(this.gradeSize);
		this.gradeDirecao[i] = new Array(this.gradeSize);
		for (var j = 0; j < this.gradeSize; j++){
		
			this.grade[i][j] = 0;
			this.gradeDirecao[i][j] = 0;
		}
	}
  
  this.encaixarPalavras();
  },
  
  colocarPalavra: function (itemIndex, direcao, inicio, teste){ //preenche ou testa a area
    
    var x = inicio[0];
    var y = inicio[1];

	var item = this.termos[itemIndex];
    var size = item.length;
    
    if (direcao == 1){
	  if (teste && (this.grade[x][y - 1] != 0 || this.grade[x][y + size] != 0)) return false;
	  if (this.tamRestrito && teste && ((y + size > this.limites[3] ? y + size : this.limites[3]) - (y < this.limites[1] ? y : this.limites[1])) > this.maxArea) return false;
      for (var i = 0; i < size; i++){
        
	    if (teste) {
			if ((this.grade[x][y + i] != 0 && this.grade[x][y + i] != item.charAt(i)) || (this.gradeDirecao[x][y + i] & 1) != 0 || (this.gradeDirecao[x - 1][y + i] & 4) != 0 || (this.gradeDirecao[x + 1][y + i] & 4) != 0) return false;
		}
        else {
			this.grade[x][y + i] = item.charAt(i);
			this.gradeDirecao[x][y + i] = this.gradeDirecao[x][y + i] | 1;
			if (i == 0 || i == size - 1) this.gradeDirecao[x][y + i] = this.gradeDirecao[x][y + i] | 4;
		}
      }
    }
    else{
	  if (teste && (this.grade[x - 1][y] != 0 || this.grade[x + size][y] != 0)) return false;
	  if (this.tamRestrito && teste && ((x + size > this.limites[2] ? x + size : this.limites[2]) - (x < this.limites[0] ? x : this.limites[0])) > this.maxArea) return false;
      for (var i = 0; i < size; i++){
	  
	    if (teste) {
			if ((this.grade[x + i][y] != 0 && this.grade[x + i][y] != item.charAt(i)) || (this.gradeDirecao[x + i][y] & 2) != 0 || (this.gradeDirecao[x + i][y - 1] & 4) != 0 || (this.gradeDirecao[x + i][y + 1] & 4) != 0) return false;
		}
		else {
			this.grade[x + i][y] = item.charAt(i);
			this.gradeDirecao[x + i][y] = this.gradeDirecao[x + i][y] | 2;
			if (i == 0 || i == size - 1) this.gradeDirecao[x + i][y] = this.gradeDirecao[x + i][y] | 4;
		}
      }

    }

	if (!teste) {
	
		if (this.limites[0] > x) this.limites[0] = x;
		if (this.limites[1] > y) this.limites[1] = y;
		this.usados[itemIndex] = direcao;
		this.posicaoTermos[itemIndex] = [x, y];
		if (direcao == 1){
			if (this.limites[3] < y + size - 1) this.limites[3] = y + size - 1;
		}
		else{
			if (this.limites[2] < x + size - 1) this.limites[2] = x + size - 1;
		}
	}
	return true;
	
  },
  
  encaixarPalavras: function(){
	
	var escolha = 0; // parseInt(Math.random() * this.termos.length * 0.8);
	
	var meio = parseInt((this.gradeSize - this.termos[escolha].length) / 2);
	var meioXY = [meio, meio];
	this.colocarPalavra(escolha,1, meioXY, false);
	var result, direcao;
	var inicio = [0,0];
	
	for (var tenta = 0; tenta < 4; tenta ++){
		for (var i = 0; i < this.termos.length; i++){
			for (var j = 0; j < this.termos.length; j++){
			
				if (this.usados[j] == 0 && this.usados[i] != 0 && i != j){
				
					
					result = this.conexaoTermos(i, j);
					if (result !== false){
					
						//console.log(result);
					
						direcao = (this.usados[i] == 1) ? 2 : 1;
						
						if (direcao == 2){
						
							inicio[1] = this.posicaoTermos[i][1] + result[2];
							inicio[0] = this.posicaoTermos[i][0] - result[3];
						}
						else{
						
							inicio[1] = this.posicaoTermos[i][1] - result[3];
							inicio[0] = this.posicaoTermos[i][0] + result[2];
						}
						
						if (this.colocarPalavra(j,direcao, inicio, true) === true){
							this.colocarPalavra(j,direcao, inicio, false);
							//console.log(this.termos[j] + '|' + direcao + '|' + inicio[0] + '|' + inicio[1] + '||' + tenta);
						}
					}
				}
			}
		}
	}
	
  if (this.usados.indexOf(0) != -1 && this.tentativas < 40) { // tenta ate 20 vezes
  
	if (this.tentativas == 20 && this.tamRestrito) this.maxArea = this.maxArea * 1.5;
	
	this.tentativas ++;
	this.inicia();
	
  }
  
  this.mostraTabela('jogo');
  
  },
  
  conexaoTermos: function(itemIndex1, itemIndex2){
  
	
	var item1 = this.termos[itemIndex1];
 	var item2 = this.termos[itemIndex2];
	var direcao1 = this.usados[itemIndex1];
	var direcao2 = (direcao1 == 1) ? 2 : 1;
	var posicao = this.posicaoTermos[itemIndex1];
	
	if (Math.random() < 0.5){
		for (var i = 0; i < item1.length; i++){
			if (direcao1 == 1){
				if ((this.grade[posicao[0]][posicao[1] + i] & 3) == 3) continue;
			}
			else {
				if ((this.grade[posicao[0] + i][posicao[1]] & 3) == 3) continue;
			}
			for (var j = 0; j < item2.length; j++){
			
				if (item1.charAt(i) == item2.charAt(j)) return [itemIndex1, itemIndex2, i, j, item1.length, item2.length];
			}
		}
	}
	else{
		for (var i = item1.length - 1; i >= 0; i--){
			if (direcao1 == 1){
				if ((this.grade[posicao[0]][posicao[1] + i] & 3) == 3) continue;
			}
			else {
				if ((this.grade[posicao[0] + i][posicao[1]] & 3) == 3) continue;
			}
			for (var j = 0; j < item2.length; j++){
			
				if (item1.charAt(i) == item2.charAt(j)) return [itemIndex1, itemIndex2, i, j, item1.length, item2.length];
			}
		}
	}
	
	return false;
 },
 
 colocaNumero: function(){
 
	var local, tipo;
	var saida = '<ol>';
	var repetido = [];
	var repItem;
	
	for (var i = 0; i < this.usados.length; i++){
	
		local = this.posicaoTermos[i];
		tipo = this.usados[i];
		
		if (typeof this.descricao[i] == 'undefined') saida += "<li>[without description]</li>";
		else saida += "<li>"+this.descricao[i]+"</li>";

		
		if (tipo == 1){
			repItem = repetido.indexOf("["+(local[0])+","+(local[1]-1)+"]");
			if (repItem != -1) this.grade[local[0]][local[1] - 1] = "<span style='font-size: 0.5em;'><b>" + (repItem + 1).toString() + "." + (1 + i).toString() + ".</b></span>";
			else this.grade[local[0]][local[1] - 1] = "<span style='font-size: 0.5em;'><b>" + (1 + i).toString() + ".</b></span>";
			repetido.push("["+local[0]+","+(local[1]-1)+"]");
		}
		else if (tipo == 2){
			repItem = repetido.indexOf("["+(local[0]-1)+","+(local[1])+"]");
			if (repItem != -1) this.grade[local[0] - 1][local[1]] = "<span style='font-size: 0.5em;'><b>" + (1 + i).toString() + "." + (repItem + 1).toString() + ".</b></span>";
			else this.grade[local[0] - 1][local[1]] = "<span style='font-size: 0.5em;'><b>" + (1 + i).toString() + ".</b></span>";
			repetido.push("["+(local[0]-1)+","+(local[1])+"]");
		}
	}
	
	saida += "</ol>";

	return saida;
 
 },
 
 mostraTabela: function(d, vazio){
 
	var va = false;
	if (typeof vazio != 'undefined'){
	
		if (vazio) va = true;
	}
  
	var saida = '';
	var valor;
	
	if (this.usados.indexOf(0) != -1) saida += "<p>Nao conseguiu colocar todas as palavras.<br>Tente novamente com alguma modificacao nas palavras!</p>";
	
	var lista = this.colocaNumero();
	
	saida += "<TABLE><TBODY>";
	for (var i = this.limites[0] - 1; i <= this.limites[2]; i++){
		saida += "<TR>";
		for (var j = this.limites[1] - 1; j <= this.limites[3]; j++){
	
			if (!va) valor = (this.grade[i][j] == 0) ? '<td>&nbsp;</td>' : "<TD class='letra'>"+this.grade[i][j]+"</TD>";
			else valor = (this.grade[i][j] == 0) ? '<td>&nbsp;</td>' : "<TD class='letra'>"+(this.grade[i][j].toString().length > 1 ? this.grade[i][j] : "&nbsp;")+"</TD>";
			
			saida += valor;			
		}
		saida += "</TR>\r\n";
	}
	saida += "</TBODY></TABLE>";
	
	saida += "<br>" + lista;
	
	document.getElementById(d).innerHTML = saida;
	

},
  
};


var palavras = [];

function corrigeTexto(){

	var content = document.getElementById('entradas');
	var posicao = content.selectionStart;

	content.value = content.value.replace(/[^0-9a-z:\-\. \n\?]/gmi,"");
	content.value = content.value.replace(/\n\n/gmi,"\n");
	//if (posicao > 0) posicao--;
	content.setSelectionRange(posicao, posicao);
	
};

document.getElementById('entradas').addEventListener("keypress",corrigeTexto);

document.getElementById('entradas').addEventListener("change",corrigeTexto);

function receber(){

	var p = document.getElementById('entradas').value;
	
	sessionStorage.setItem("textoSalvo", p);
	
	p = p.replace(/\r/gm, "");
	var p2 = p.split("\n");
	palavras = [];
	p2.forEach(function(value){
		if (value.length > 2) palavras.push(value);
	});

	if (palavras.length > 2){
	
		jogo.tentativas = 0;
		jogo.inicia();
	
	};
	

}

function vazio(){

	jogo.mostraTabela('jogo',true);

}

function cheio(){

	jogo.mostraTabela('jogo',false);

}

function printElem(){

    var mywindow = window.open('', 'PRINT', 'height=600,width=800');
	
	var style = "body{color: black; margin-left: auto; margin-right: auto; text-align: center; font-family: \"calibri\"; } table{font-size: 20px;border: none;border-spacing: 1px;margin-left: auto;margin-right: auto;} td{padding: 0px;} td.letra{height: 20px;width: 20px;vertical-align: middle;text-align: center;	border: 1px solid #000000;} ol{text-align: left;}";
	
	
	mywindow.document.write("<!DOCTYPE HTML><html><head><title>Palavras Cruzadas</title><style>"+style+"</style></head><body><div id='jogo'>"+(document.getElementById('jogo').innerHTML)+"</div></body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

function recuperaTexto(){

	var estado = sessionStorage.getItem('textoSalvo');
	var p = document.getElementById('entradas');
	
	if (estado) p.value = estado;

}

//console.log(jogo.termos);
//console.log(jogo.usados);
//console.log(jogo.grade);
//console.log(jogo.gradeDirecao);
//console.log(jogo.posicaoTermos);
//console.log(jogo.limites);


