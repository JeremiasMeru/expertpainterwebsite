$('.gallery-link').on('click', function () {
    $(this).next().magnificPopup('open');
});

$('.gallery').each(function () {
    $(this).magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true,
            navigateByImgClick: true
        },
        fixedContentPos: false
    });
});