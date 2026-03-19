import { changeLikeCardStatus } from './api.js';

export const createCardElement = (cardData, handlers, currentUserId) => {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.cloneNode(true).children[0];

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__control-button_type_delete');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  const isLiked = cardData.likes.some(user => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner && cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      handlers.onDeleteCard(cardData._id, cardElement);
    });
  } else {
    deleteButton.remove();
  }
  likeButton.addEventListener('click', () => {
    const isLikedNow = likeButton.classList.contains('card__like-button_is-active');

    likeButton.disabled = true;

    changeLikeCardStatus(cardData._id, isLikedNow)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
        cardData.likes = updatedCard.likes;
      })
      .catch((err) => {
        console.log('Ошибка при изменении лайка:', err);
      })
      .finally(() => {
        likeButton.disabled = false;
      });
  });
  cardImage.addEventListener('click', () => handlers.onPreviewPicture(cardData));

  return cardElement;
};