class CalcController {
 
   
    constructor() {
       
        this._lastOperator = ''; // guarda o numero
        this._lastNumber = ''; // guar o operador para usar no get result

        this._audio = new Audio('click.mp3');  // esta chamando o clicl.mp3  procura audio web api
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this.currentDate;
       
        this.initialize();
        this.initButtonsEvents();
 
    }
 
    initialize() {
 
        this.setDisplayDateTime();
 
        setInterval(() => {
 
            this.setDisplayDateTime();
 
        }, 1000);


        // procura o botao ac
        document.querySelectorAll('.btn-ac').forEach(btn => {
            // duplo clik para ativar o som
            btn.addEventListener('dblclick', e => {

                this.toggleAudio(); // verifica se o audio esta ligado ou desligado

            });

        });

 
    }


    toggleAudio() {
/*
        if (this._audioOnOff) {
            this._audioOnOff = false;
        } else {
            this._audioOnOff = true;
        }

        ou
                             ele exist      se sim false senao true                                                  
        this._audioOnOff = (this._audioOnOff) ? false : true;

        comando ao contrario se ele é true fica false senao true
         this._audioOnOff = !this._audioOnOff;

*/
        // if ternario
        this._audioOnOff = !this._audioOnOff;

 
    }

    // toca o som
    playAudio() {

        if (this._audioOnOff) {   // verifica se pode tocar o audio
            
            this._audio.currentTime = 0; // antes de dar o play volta para zero fica mais rapido
            this._audio.play();

        }

    }



    //copia para area de transferencia

    // esse comando foi feito por causa do sgv
    copyToClipboard() {

        let input = document.createElement('input'); // criando um elemento na tela de input

        input.value = this.displayCalc;  //colocar o valor dentro do input

        document.body.appendChild(input); // adiciona o elemento input no body

        input.select();                     // seleciona o arquivo

        document.execCommand("Copy");       //copia tudo onde esta selecionado que é o displaycacl

        input.remove();                     // remove para nao aparece

    }

    //colar copiar da area de transverencia
    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });

    }

    /********************************************* */
 
    //evento de teclado

    // tambem pode ser usado addEventListenerAll informando mas de um comando de teclado
    // keypress - quando preciona
    // keydown - enquanto esta segurando
    //keyup - quando solta
  
    initKeyboard() {

        document.addEventListener('keyup', e => {

            //console.log(e);

            this.playAudio();

            switch (e.key) {
                case 'Escape':  //esc
                    this.clearAll();
                    break;
                case 'Backspace': 
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':  //apertou o c mais o ctr e se é tru chama o this
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
                
            }

        });

    }


    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clearAll() {
        this._operation = [];   // limpa o array
        this._lastNumber = '';  // limpa ultimo numero na memoria
        this._lastOperator = ''; // limpa o operador

        this.setLastNumberToDisplay();  // mostra na tela
    }


    clearEntry() {
        // elimina o ultimo do array
        this._operation.pop();      
    }


    getLastOperation(){
        // operetion é um array, estou pegando o ultimo operacao
        return this._operation[this._operation.lenght-1]; 
        // window.isNaN como dentro o window nao precisa colocar window colcoa isNaN
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
  
 /*     if (['+', '-', '*', '%', '/'].indexOf(value) > -1) {
            return true;  // é um operador
        } else {
            return false; // nao é um operador
        }
 */
    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;

    }

    pushOperation(value) {
        // soma em pares
        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult() {

        // esta    
        try {       //tentar fazer o ocdigo aconteser
            return eval(this._operation.join(""));
        } catch (e) {  // se der erro
            //como esta chamando em outros ele fica zero entao coloca um tempo para mostrar depois do zero
            setTimeout(() => this.setError(), 1);  // um milesegundo escreve o erro
        }

    }

    calc() {
/*
        [10, '+', 90 ]
        [10, '+', 90 ].toString()
        "10,+,90"
        [10, '+', 90 ].join("")  // join é o inverto do split ele coloca separador

        // eval('10+20');
*/
        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        // so pode tira o ultima se for maior que 3
        if (this._operation.length > 3) {

            last = this._operation.pop();  // pega o ultima do array
            //last result = eval(this._operation.join("")); // soma os par
            this._lastNumber = this.getResult(); //guardo o numero do resultado

        } else if (this._operation.length === 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        //calculo da porcentagem
        if (last === '%') {   // o calculo tem que ser diferente senao pega o resto

            // result = result /100 ou executa o comando abaixo é a mesma coisa
            result /= 100;  // ele mesmo dividido por 100
            this._operation = [result];  // adicionando 

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay(); // atuliza a tela

    }


    //calulator.getLastItem() = +
    //calulator.getLastItem(false) = 5
    //paseInt convert para inteiro
    //parsefloat = numeros frasionados

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) === isOperator) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem) {  // estava perdendo o operador, estao continua com o mesmo

            //            condicao se for verdade  ? = entao  : = senao     
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    setLastNumberToDisplay() {  // atualiza  a tela

        let lastNumber;



        for(let i = this.getLastOperation.length-1; i >= 10; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }

        // se for vazio atribuie zero
        if (!lastNumber) lastNumber = 0; 


        this.displayCalc = lastNumber;
        

/*        for(let i = 0; i <= 10; i++){
            console.log(i);
        }
        
        for(let i = 10; i>= 0; i--){
            console.log(i);
        }
  */  
        
    }
    
    
    

    addOperation(value){
        
        console.log('A', value, isNan(this.getLastOperation()));
        if(isNaN(this.getLastOperation())) {
            //string = false  operadores de soma menos 
            if(this.isOperator(value)){
                //trocar o operador se for igual

                setLastOperation(value);
            } else if(isNaN(value)) {
                // outra coisa
                console.log(value);
            } else {
                this._operation.push(value);  
            }
        } else {
            //number = true
            let newValue = this.getLastOperation().toString + value.toString();
            setLastOperation(parInt(newValue));
        }


        // puch coloca um valor no fim do array
        //this._operation.push(value);  
        //console.log(this._operation);
    }

    setError() {

        this.displayCalc = "Error";

    }

    addDot() {

        let lastOperation = this.getLastOperation(); // pega a ultima operação

        // estou verificando se ja tem o ponto se tiver saio
        // verifico se o lastoperation é string
        // é um texto vaz um split e verifica se tem um ponto = indexOF
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        // || = or 
        if (this.isOperator(lastOperation) || !lastOperation) { // verifica se é um operação
            this.setLastOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.'); // sobre escreve ultima operação
        }

        this.setLastNumberToDisplay();  // atuliza a tela

    }
    execBtn(value) {

   //     this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
               this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));  //parseInt ele é numero
                break;
            default:
                this.setError();
                break;
        }

    }
 
    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {

                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {

                btn.style.cursor = "pointer";

            });

        });

    }
 
 
    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        // para nao estorar os numeros na tela
        //if (value.length > 10) { como era numero nao notava
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
        
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }

}

