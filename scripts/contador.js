let listaProducao = localStorage.getItem("producao") ? JSON.parse(localStorage.getItem("producao")) : [];
let qtd = localStorage.getItem("quantidade") ? parseInt(localStorage.getItem("quantidade")) : 0;

const btnAdicionar = document.getElementById("btn-adicionar");
const btnDiminuir = document.getElementById("btn-diminuir");
const btnSalvar = document.getElementById("btn-salvar");
const contador = document.getElementById("contador");

const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
	exampleModal.addEventListener('show.bs.modal', () => {
		contador.value = qtd;
		const selectType = document.getElementById('selectType');
		const radiosSection = document.getElementById('radios-section');
		const radios = document.querySelectorAll('input[name="mandadoType"]');

		btnSalvar.removeEventListener("click", salvarTarefa);
		btnSalvar.addEventListener("click", salvarTarefa, { once: true });

		selectType.addEventListener('change', function () {
			if (selectType.value === 'mandado') {
				radiosSection.style.display = 'block';

			} else {
				radiosSection.style.display = 'none';
			}
		});

		function salvarTarefa() {
			let mandadoType = null;
			if (selectType.value === 'mandado') {
				mandadoType = 0;
				radios.forEach(radio => {
					if (radio.checked) {
						mandadoType = radio.value
					}
				})
			}
			if (selectType.value != 0 && contador.value > 0 && mandadoType !== 0) {
				if (confirm("Você deseja fechar a produção de hoje?")) {
					const data = criarData();
					const producao = {
						id: new Date().getTime(),
						data: data,
						qtd: qtd,
						documentoType: selectType.value,
						mandadoType: mandadoType,
					};

					listaProducao.push(producao);
					localStorage.setItem("producao", JSON.stringify(listaProducao));

					// Zerar valores
					qtd = 0;
					localStorage.setItem("quantidade", qtd);
					contador.value = qtd;
					selectType.value = '0'
					radiosSection.style.display = 'none';
					
					exibirCardNaTela();
					fecharModal()
				} else{
					fecharModal()
				}
			}
			else {
				alert("Preencha os campos corretamente!")
				fecharModal()
			}
		}
	})
}

btnAdicionar.addEventListener("click", () => {
	qtd++;
	localStorage.setItem("quantidade", qtd);
	contador.value = qtd;
	console.log(qtd);
});

btnDiminuir.addEventListener("click", () => {
	if (contador.value <= 0) {
		alert("Não é possivel diminuir!")
	}
	else {
		qtd--;
		localStorage.setItem("quantidade", qtd);
		contador.value = qtd;
		console.log(qtd);
	}
});

function fecharModal() {
	const modal = bootstrap.Modal.getInstance(exampleModal);
	modal.hide();
}

function exibirCardNaTela() {
	const divProducao = document.getElementById("producao");
	divProducao.innerHTML = "";
	listaProducao.forEach((producao) => {
		criarCards(producao);
	});
}

function criarData() {
	const data = new Date();
	const dia = data.getDate();
	const mes = data.getMonth() + 1;
	const ano = data.getFullYear();
	return `${dia}/${mes}/${ano}`;
}

function excluirCard(producao) {
	if (confirm("Você realmente deseja excluir essa produção?")) {
		listaProducao = listaProducao.filter((element) => element.id !== producao.id);
		localStorage.setItem("producao", JSON.stringify(listaProducao));
		exibirCardNaTela();
	}
}

function criarCards(producao) {
	const divProducao = document.getElementById("producao");
	const divCard = document.createElement('div');
	divCard.classList.add('card');
	divCard.setAttribute('id', producao.id);  // Usando o id único gerado

	// Cabeçalho do card
	const divCardHeader = document.createElement('div');
	divCardHeader.classList.add('card-header', 'bg-primary', 'text-white');
	const documentoText = `${producao.documentoType} ${producao.documentoType === 'mandado' ? '-' + producao.mandadoType : ''}`;
	divCardHeader.textContent = documentoText;

	// Corpo do card
	const divCardBody = document.createElement('div');
	divCardBody.classList.add('card-body');

	// Título do card (Data)
	const textData = document.createElement('h5');
	textData.classList.add('card-title');
	textData.textContent = "DIA: ";
	const spanData = document.createElement('span');
	spanData.setAttribute("id", "data");
	spanData.textContent = producao.data;
	textData.appendChild(spanData);

	// Quantidade de documentos
	const textQtd = document.createElement('p');
	textQtd.classList.add('card-text');
	textQtd.textContent = "Quantidade de documentos: ";
	const spanQtd = document.createElement('span');
	spanQtd.setAttribute("id", "qtd-producao");
	spanQtd.textContent = producao.qtd;
	textQtd.appendChild(spanQtd);

	// Botão para excluir
	const btnCard = document.createElement('button');
	btnCard.classList.add('btn', 'btn-primary');
	btnCard.setAttribute('id', producao.id);
	btnCard.textContent = "Excluir";
	btnCard.addEventListener('click', () => excluirCard(producao.id));

	// Montando o card
	divCardBody.appendChild(textData);
	divCardBody.appendChild(textQtd);
	divCardBody.appendChild(btnCard);
	divCard.appendChild(divCardHeader);
	divCard.appendChild(divCardBody);

	// Adicionando o card na div principal
	divProducao.appendChild(divCard);
}


exibirCardNaTela();