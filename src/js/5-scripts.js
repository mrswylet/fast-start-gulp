$(document).ready(function () {

	// Маска
	$('input[name=phone]').mask("+7 (999) 999-99-99");

	// Кастомные чекбоксы
	$('.custom-checkbox').each(function () {
		handleCheckbox($(this));
	});

	$(document).on('click', '.custom-checkbox', function (event) {
		handleCheckbox($(this));
	});

	function handleCheckbox($checkbox) {
		var $input = $checkbox.find('input[type=checkbox]'),
			$i = $checkbox.find('.checkbox');

		if ($input.prop('checked')) {
			if ($checkbox.hasClass('error')) {
				$checkbox.removeClass('error');
			}

			$i.addClass('checked');
		} else {
			$i.removeClass('checked');
		}
	}

	// Кастомные инпуты
	setFields($('.custom-field'));

	function setFields($fields) {
		$fields.each(function () {
			var $field = $(this),
				$children_fields = $field.children('input, textarea');

			$placeholder = $('<div class="custom-placeholder"></div>');

			$children_fields.on('focus click', function () {
				var $data_placeholder = $(this).data('placeholder-element');

				$data_placeholder.hide();
				$data_placeholder.text($children_fields.data('placeholder'));

				if ($field.hasClass('error')) {
					$field.removeClass('error');
				}
			}).on('blur', function () {
				var $data_placeholder = $(this).data('placeholder-element');

				if ($(this).val() == '') {
					$data_placeholder.show();
				} else {
					$data_placeholder.hide();
				}
			});

			$placeholder.on('focus click', function (event) {
				event.preventDefault();

				$(this).hide();
				$(this).siblings('input, textarea').focus();

			});

			if ($children_fields.val() != '')
				$placeholder.hide();

			$placeholder.text($children_fields.data('placeholder')).appendTo($(this));
			$children_fields.data('placeholder-element', $placeholder);

		});
	}


	// Загрузка изображений
	var assets = [
		'/img/bmc-check.png',
		'/img/cross.png'
	];

	for (var i = 0; i < assets.length; i++) {
		loadHiddenAssets(assets[i]);
	}

	function loadHiddenAssets(src) {
		var image = document.createElement('img');
		image.src = src;
	}

	// Вызов всплывающего окна по нажатию на кнопку (MFP)
	$(document).on('click', '.btn-call', function (event) {
		event.preventDefault();

		sendGoal('open_form_call');

		var title = $(this).text();

		$.magnificPopup.open({
			type: 'ajax',
			items: {
				src: 'popup-feedback.html'
			},
			callbacks: {
				ajaxContentAdded: function (mfpResponse) {
					var $popup = $('.popup-feedback-form');

					$popup.find('form').addClass('form-call');
					$popup.find('input[name=phone]').mask("+7 (999) 999-99-99");
					$popup.find('input[name=product]').val('');
					$popup.find('.title-popup-feedback').html(title);

					setFields($popup.find('.custom-field'));

					$popup.on('focus', 'input', function () {
						sendGoal('focus_form_call');
					})
				},
			}
		});
	});

	$(document).on('click', '.btn-scroll', function () {
		var $block = $($(this).data('href'));

		if ($block.length) {
			$('html, body').animate({scrollTop: $block.offset().top}, 'slow');
		}
	});

	$('.detail-about-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
		}
	});


	$(document).on('click', '.btn-order', function (event) {
		event.preventDefault();

		var $this = $(this);
		var $title = $this.closest('.catalog__item').children('h3');

		if ($title.length === 0) {
			$title = $this.siblings('h4');
		}

		var product_name = $title.text();

		sendGoal('open_form_order', {name_product: product_name});

		$.magnificPopup.open({
			type: 'ajax',
			items: {
				src: 'popup-feedback.html'
			},
			callbacks: {
				ajaxContentAdded: function (mfpResponse) {
					var $popup = $('.popup-feedback-form');

					$popup.find('form').addClass('form-order');
					$popup.find('input[name=phone]').mask("+7 (999) 999-99-99");
					$popup.find('input[name=product]').val(product_name);
					$popup.find('.title-popup-feedback').html('Заказ на <small>' + product_name + '</small>');

					setFields($popup.find('.custom-field'));

					$popup.on('focus', 'input', function () {
						sendGoal('focus_form_order');
					})
				},
			}
		});
	})

	// Обработка и отправка формы по нажатию на кнопку
	$(document).on('submit', '.section-cta form', function (event) {
		event.preventDefault();
	});

	$(document).on('click', '.btn-submit', function (event) {
		event.preventDefault();

		var $button = $(this),
			$form = $(this).parents('form');

		if ($button.hasClass('btn-loading'))
			return false;

		$form.find('.error').removeClass('error');

		var $phone = $form.find('input[name="phone"]'),
			$agree = $form.find('.form-call__agree input');


		if ($phone.val() == '') {
			$phone.parent().addClass('error');
			$phone.data('placeholder-element').text('Пожалуйста, укажите ваш телефон!');
		}

		if (!$agree.prop('checked')) {
			$agree.parent().addClass('error');
		}


		if (!$form.find('.error').length) {
			$.ajax({
				url: '/mailer.php',
				type: 'post',
				data: $form.serialize() + '&ajax=1',
				beforeSend: function () {
					$button.addClass('btn-loading');
				},
				complete: function () {
					$button.removeClass('btn-loading').blur();

					if ($form.hasClass('form-order')) {
						sendGoal('submit_form_order');
					}

					if ($form.hasClass('form-call')) {
						sendGoal('submit_form_call');
					}

				},
				success: function (res) {
					setTimeout(function () {
						$form[0].reset();

						if ($('.popup-feedback-form').length) {
							var $popup = $('.popup-feedback-form');
						} else {
							var $popup = $('.section-cta');
						}

						$popup.find('.title-popup-feedback').text('Форма отправлена!');
						$popup.find('.form-call').html('<p class="success">Спасибо за вашу заявку! Наш специалист свяжется с вами в кратчайшие сроки.</p>');
					}, 2000);
				}
			});
		}
	});

	$(document).on('click', '.tel-number', function (event) {
		event.preventDefault();

		var el_location = $(this).prop('href'),
			callback = function () {
				window.location = el_location;
			};

		var tel_number = $(this).text();

		sendGoal('click_telephone_number', {telephone_number: tel_number}, callback);

	});

	$(document).on('click', '.messangers__target a', function (event) {
		event.preventDefault();

		var el_location = $(this).prop('href'),
			callback = function () {
				window.location = el_location;
			};

		if ($(this).hasClass("icon-whatsup")) {
			sendGoal('click_whatsup', {}, callback);
		}

		if ($(this).hasClass("icon-viber")) {
			sendGoal('click_viber', {}, callback);
		}

		if ($(this).hasClass("icon-telegram")) {
			sendGoal('click_telegram', {}, callback);
		}
	})


	var resizer;
	$(window).resize(function () {
		clearTimeout(resizer);
		resizer = setTimeout(
			function () {
				toggelTabsGo();
			}, 300);
	});

	$('.tabs__btn').on('click', function () {
		var $this = $(this);
		var id = $this.data('tab-id');
		var $items = $this.closest('.tabs').find('.tabs__item');
		$this.siblings().removeClass('active');
		$this.addClass('active');
		console.log($items)
		$items.hide();
		$items.filter('[data-tab-id="' + id + '"]').show();
		toggelTabsGo();
	});

	function toggelTabsGo() {
		var tab = document.querySelector('.tabs__btn.active');
		var tab_go = document.querySelector('.tabs__go');

		if (tab) {
			if ($(window).width() > 767) {
				var left = tab.offsetLeft;
				var width = tab.clientWidth;
				$(tab_go)
					.css({
						bottom: 0,
						top: 'auto'
					})
					.animate(
					{
						left: left,
						width: width
					},
					150);
			} else {
				var top = tab.offsetTop;
				$(tab_go).animate(
					{
						left: 0,
						top: top
					},
					150);
			}

		}
	}
});


function sendGoal(goal_id, goal_params, goal_callback) {
	var goal_callback = goal_callback || function () {
	};

	if (typeof window['yaCounter48677783'] !== "undefined") {
		if (goal_params)
			window['yaCounter48677783'].reachGoal(goal_id, goal_params, function () {
				window.goal_params = {};
				goal_callback();
			});
		else
			window['yaCounter48677783'].reachGoal(goal_id);
	}
}