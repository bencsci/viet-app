function getNewDueDate(interval) {
  const date = new Date();

  if (interval >= 1) {
    date.setDate(date.getDate() + Math.ceil(interval));
  } else {
    date.setHours(date.getHours() + interval * 24);
  }

  return date;
}

function updateMastery(card, score) {
  card.total_reviews += 1;

  // If this is the *first* review, jump straight to predefined values
  if (card.total_reviews === 1) {
    switch (score) {
      case 5:
        card.mastery = 80;
        break;
      case 4:
        card.mastery = 65;
        break;
      case 3:
        card.mastery = 50;
        break;
      case 2:
        card.mastery = 20;
        break;
      case 1:
      default:
        card.mastery = 5;
        break;
    }
    return;
  }

  // For subsequent reviews:
  if (score >= 3) {
    // PASS

    // Gives bonus for answering correctly after wrong streak
    let bonus = 0;
    if (card.streak <= 3 && card.total_reviews > 5) {
      bonus = 0.3;
    }

    // Balance out the bonus for longer streaks
    let balance = 0;
    if (card.streak >= 30 && card.total_reviews > 10) {
      balance = -0.15;
    }

    // Give more weight to better scores for more percent increase
    let baseFraction;
    if (score === 3) {
      baseFraction = 0.2 + bonus + balance;
    } else if (score === 4) {
      baseFraction = 0.3 + bonus + balance;
    } else {
      baseFraction = 0.4 + bonus + balance;
    }

    // Lose percentage if you answer hard at mastery 80-90
    if (card.mastery >= 80 && card.mastery <= 90 && card.streak >= 5) {
      if (score === 3) {
        baseFraction = -0.1;
      }
    }

    // Lose lots of percentage if you answer hard ast mastery 90-95 and lose more at 95+
    if (card.mastery >= 90 && card.mastery <= 100 && card.streak >= 5) {
      if (score === 3) {
        baseFraction = -1.5;
      } else if (score === 3 && card.mastery >= 95) {
        baseFraction = -4;
      }
    }

    const fraction = baseFraction / 2.5;

    // Move mastery up by that fraction of the "remaining gap" to 100%
    card.mastery = card.mastery + fraction * (100 - card.mastery);
  } else {
    // FAIL (score <= 2)
    // Multiply the current mastery by a "drop factor."

    // Limit the drop factor if continually answer wrong
    let dropH;
    let dropF;
    if (card.streak <= 3) {
      dropH = 0.96;
      dropF = 0.92;
    } else {
      dropH = 0.75;
      dropF = 0.65;
    }

    if (score === 2) {
      card.mastery = card.mastery * dropH;
    } else {
      // score === 1
      card.mastery = card.mastery * dropF;
    }
  }

  if (card.mastery < 0) {
    card.mastery = 0;
  } else if (card.mastery > 100) {
    card.mastery = 100;
  }
}

export { getNewDueDate, updateMastery };
