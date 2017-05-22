export default class Popup {
	constructor(model) {
		this.model = model;
		this.popup = document.querySelector('#popup');
		this.overlay = document.querySelector('#darkness');
		this.popupText = document.querySelector('#popup h2');
		this.popupBottomText = document.querySelector('#popup p');

		this.closeEvent = this.closePopup.bind(this);
		this.reloadEvent = this.reloadPopup.bind(this);

		this.addStyles();
		this.closePopup();
	}

	showPopup() {
		this.popup.classList.remove('closed');
		this.overlay.classList.remove('closed');
	}

	showReloadPopup(message = 'Connection problem') {
		this.showPopup();

		this.bottomText = (this.model.desktop)? 'Click to reload' : 'Tap to reload';

		this.popupText.innerHTML = message;
		this.popupBottomText.innerHTML = this.bottomText;

		this.clearEvents();
		this.popup.addEventListener('click', this.reloadEvent);
	}

	showClosePopup(message) {
		this.showPopup();

		this.bottomText = (this.model.desktop)? 'Click to close' : 'Tap to close';

		this.popupText.innerHTML = message;
		this.popupBottomText.innerHTML = this.bottomText;

		this.clearEvents();
		this.popup.addEventListener('click', this.closeEvent);
	}

	reloadPopup() {
		if (urlParams.homeurl) {
			window.top.location.href = urlParams.homeurl;
		} else {
			window.history.back();
		}
	}

	closePopup() {
		this.popup.classList.add('closed');
		this.overlay.classList.add('closed');
	}

	clearEvents() {
		this.popup.removeEventListener('click', this.reloadEvent)
		this.popup.removeEventListener('click', this.closeEvent)
	}

}