let listaProducao = localStorage.getItem("producao") ? JSON.parse(localStorage.getItem("producao")) : [];
exibirCardNaTela();

const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
	exampleModal.addEventListener('show.bs.modal', () => {
		let qtd = localStorage.getItem("quantidade") ? parseInt(localStorage.getItem("quantidade")) : 0;

		const btnAdicionar = document.getElementById("btn-adicionar");
		const btnDiminuir = document.getElementById("btn-diminuir");
		const btnSalvar = document.getElementById("btn-salvar");

		const contador = document.getElementById("contador");
		contador.value = qtd;

		const selectType = document.getElementById('selectType');
		const radiosSection = document.getElementById('radios-section');
		const radios = document.querySelectorAll('input[name="mandadoType"]');

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

		btnSalvar.removeEventListener("click", salvarTarefa);
		btnSalvar.addEventListener("click", salvarTarefa, { once: true });

		function salvarTarefa() {
			if (selectType.value != 0 && contador.value > 0) {
				let mandadoType = null;
				if (selectType.value === 'mandado') {
					mandadoType = 0;
					radios.forEach(radio => {
						if (radio.checked) {
							mandadoType = radio.value
						}
					})
				}

				if (mandadoType === 0) {
					alert("Selecione um tipo de mandado!");
					const modal = bootstrap.Modal.getInstance(exampleModal);
					modal.hide();
					return;
				}

				if (confirm("Você deseja fechar a produção de hoje?")) {
					const data = criarData();
					const producao = {
						id: new Date().getTime(),
						data,
						qtd,
						documentoType: selectType.value,
						mandadoType: mandadoType,
					};

					listaProducao.push(producao);
					localStorage.setItem("producao", JSON.stringify(listaProducao));

					// Zerar valores
					qtd = 0;
					localStorage.setItem("quantidade", qtd);
					contador.value = qtd;
					exibirCardNaTela();

					// Fechar o modal
					const modal = bootstrap.Modal.getInstance(exampleModal);
					modal.hide();
				}
			}
			else {
				alert("Preencha os campos corretamente!")
				const modal = bootstrap.Modal.getInstance(exampleModal);
				modal.hide();
			}

		}

		selectType.addEventListener('change', function () {
			if (selectType.value === 'mandado') {
				radiosSection.style.display = 'block';

			} else {
				radiosSection.style.display = 'none';
			}
		});
	});
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

function criarCards(producao) {
	const divProducao = document.getElementById("producao");
	const divCard = document.createElement('div');
	divCard.classList.add('card');
	divCard.setAttribute('id', producao.id);  // Usando o id único gerado

	const textData = document.createElement('h3');
	textData.classList.add('text-data');
	textData.textContent = "DIA: ";

	const spanData = document.createElement('span');
	spanData.setAttribute("id", "data");
	spanData.innerHTML = producao.data;
	textData.appendChild(spanData);

	const textQtd = document.createElement('h2');
	textQtd.classList.add('text-producao');
	textQtd.textContent = "Quantidade de documentos: ";

	const spanQtd = document.createElement('span');
	spanQtd.setAttribute("id", "qtd-producao");
	spanQtd.innerHTML = producao.qtd;
	textQtd.appendChild(spanQtd);

	const btnCard = document.createElement('button');
	btnCard.classList.add('btn-card');
	btnCard.setAttribute('id', producao.id);
	btnCard.textContent = "Excluir";
	btnCard.addEventListener('click', () => excluirCard(producao));

	divCard.appendChild(textData);
	divCard.appendChild(textQtd);
	divCard.appendChild(btnCard);
	divProducao.appendChild(divCard);
}

function excluirCard(producao) {
	if (confirm("Você realmente deseja excluir essa produção?")) {
		listaProducao = listaProducao.filter((element) => element.id !== producao.id);
		localStorage.setItem("producao", JSON.stringify(listaProducao));
		exibirCardNaTela();
	}
}
