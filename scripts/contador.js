let listaProducao = localStorage.getItem("producao") ? JSON.parse(localStorage.getItem("producao")) : [];

const btnAdicionar = document.getElementById("btn-adicionar");
const btnDiminuir = document.getElementById("btn-diminuir");
const btnSalvar = document.getElementById("btn-salvar");
const btnEditar = document.getElementById("btn-editar");
const contador = document.getElementById("contador");
const filtro = document.getElementById('selectFiltro')

const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {
	exampleModal.addEventListener('show.bs.modal', () => {
		btnEditar.style.display = 'none'
		btnSalvar.style.display = 'block'
		
		let qtd = 0;
		contador.value = qtd;
		const selectType = document.getElementById('selectType');
		const radiosSection = document.getElementById('radios-section');
		const radios = document.querySelectorAll('input[name="mandadoType"]');

		btnAdicionar.addEventListener("click", () => {
			qtd += 1;
			contador.value = qtd;
		})
		btnDiminuir.addEventListener("click", () => {
			if (contador.value <= 0) {
				alert("Não é possivel diminuir!")
			}
			else {
				qtd -= 1;
				contador.value = qtd;
			}
		})

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
			console.log("criar")
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

					exibirCardNaTela(listaProducao);
					fecharModal()
				} else {
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

function adicionarQuantidade(qtd) {

}

function dimiuirQuantidade(qtd) {

}

filtro.addEventListener('change', () => {
	if (filtro.value !== '0') {
		listaFiltrada = listaProducao.filter(element => element.documentoType === filtro.value)
		exibirCardNaTela(listaFiltrada);
	}
	else {
		exibirCardNaTela(listaProducao);
	}
})


function fecharModal() {
	const modal = bootstrap.Modal.getInstance(exampleModal);
	modal.hide();
}

function exibirCardNaTela(listaExibir) {
	const divProducao = document.getElementById("producao");
	divProducao.innerHTML = "";
	listaExibir.forEach((producao) => {
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
		exibirCardNaTela(listaProducao);
	}
}

function editarCard(producao) {
	const modal = new bootstrap.Modal(exampleModal);
	modal.show();
	btnEditar.style.display = 'block';
	btnSalvar.style.display = 'none';
	let qtd = producao.qtd

	btnAdicionar.addEventListener("click", () => {
		qtd += 1;
		contador.value = qtd;
	})
	btnDiminuir.addEventListener("click", () => {
		if (contador.value <= 0) {
			alert("Não é possivel diminuir!")
		}
		else {
			qtd -= 1;
			contador.value = qtd;
		}
	})

	contador.value = producao.qtd;  // Define a quantidade no campo contador
	const selectType = document.getElementById('selectType');
	const radiosSection = document.getElementById('radios-section');
	const radios = document.querySelectorAll('input[name="mandadoType"]');

	// Se o tipo de documento for "mandado", exibe as opções de mandado
	if (producao.documentoType === 'mandado') {
		selectType.value = 'mandado';
		radiosSection.style.display = 'block';
		radios.forEach(radio => {
			if (radio.value === producao.mandadoType) {
				radio.checked = true;
			}
		});
	} else {
		selectType.value = producao.documentoType;
		radiosSection.style.display = 'none';
	}

	// Remover o evento anterior e adicionar um novo para salvar
	btnEditar.removeEventListener("click", editarTarefa);
	btnEditar.addEventListener("click", editarTarefa, { once: true });

	// Função para salvar a tarefa editada
	function editarTarefa() {
		console.log("editar")
		let mandadoType = null;
		if (selectType.value === 'mandado') {
			mandadoType = 0;
			radios.forEach(radio => {
				if (radio.checked) {
					mandadoType = radio.value;
				}
			});
		}

		if (selectType.value != 0 && contador.value > 0 && mandadoType !== 0) {
			if (confirm("Você deseja salvar as alterações?")) {
				const data = criarData();

				producao.qtd = qtd;
				producao.documentoType = selectType.value;
				producao.mandadoType = mandadoType;
				producao.data = data;

				// Atualiza no localStorage
				listaProducao = listaProducao.map(item =>
					item.id === producao.id ? producao : item
				);
				localStorage.setItem("producao", JSON.stringify(listaProducao));

				// Zera os valores e fecha o modal
				qtd = 0;
				localStorage.setItem("quantidade", qtd);
				contador.value = qtd;
				selectType.value = '0';
				radiosSection.style.display = 'none';

				exibirCardNaTela(listaProducao);
				fecharModal();
			} else {
				fecharModal();
			}
		} else {
			alert("Preencha os campos corretamente!");
			fecharModal();
		}
	}
}


function criarCards(producao) {
	const divProducao = document.getElementById("producao");
	const divCard = document.createElement('div');
	divCard.classList.add('card');
	divCard.setAttribute('id', producao.id);  // Usando o id único gerado

	// Cabeçalho do card
	const divCardHeader = document.createElement('div');
	divCardHeader.classList.add('card-header', 'text-white');
	if (producao.documentoType === 'medida') {
		divCardHeader.classList.add('bg-primary');
	} else if (producao.documentoType === 'mandado') {
		divCardHeader.classList.add('bg-warning');
	}
	else {
		divCardHeader.classList.add('bg-success');
	}
	const documentoText = `${producao.documentoType} ${producao.documentoType === 'mandado' ? '- ' + producao.mandadoType : ''}`;
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
	btnCard.classList.add('btn');
	if (producao.documentoType === 'medida') {
		btnCard.classList.add('btn-primary');
	} else if (producao.documentoType === 'mandado') {
		btnCard.classList.add('btn-warning');
	}
	else {
		btnCard.classList.add('btn-success');
	}
	btnCard.setAttribute('id', producao.id);
	btnCard.textContent = "Excluir";
	btnCard.addEventListener('click', () => {
		excluirCard(producao)
	});

	// Botão para excluir
	const btnEditarCard = document.createElement('button');
	btnEditarCard.classList.add('btn');
	if (producao.documentoType === 'medida') {
		btnEditarCard.classList.add('btn-primary', 'ms-2');
	} else if (producao.documentoType === 'mandado') {
		btnEditarCard.classList.add('btn-warning');
	}
	else {
		btnEditarCard.classList.add('btn-success');
	}
	btnEditarCard.setAttribute('id', producao.id);
	btnEditarCard.textContent = "Editar";
	btnEditarCard.addEventListener('click', () => {
		editarCard(producao)
	});

	// Montando o card
	divCardBody.appendChild(textData);
	divCardBody.appendChild(textQtd);
	divCardBody.appendChild(btnCard);
	divCardBody.appendChild(btnEditarCard);
	divCard.appendChild(divCardHeader);
	divCard.appendChild(divCardBody);

	// Adicionando o card na div principal
	divProducao.appendChild(divCard);
}

exibirCardNaTela(listaProducao);