/**
 * This is the algorithm used in Fresh Cards, as of v2.0.
 *
 * Similar to Anki, this is based on the general ideas of SM-2 and makes
 * these adjustments:
 *
 * - give bonus if card is reviewed late, but still remembered correctly
 * - don't adjust eFactor if card is being learned
 * - go back to "learning" stage if you fail a card, to avoid being punished
 *   each time you get it wrong
 * - review times are "fuzzed" to avoid bunching up the same cards in lessons
 *
 * Since Fresh Cards schedules cards *within* a lesson differently from Anki,
 * the initial intervals are 30m, 12h, and 1d instead of 1m, 10m, 1d.
 *
 * Visit https://www.ussherpress.com/freshcards/ to check out the app.
 */
function srsFunc(card, evaluation) {
  var streak, eFactor, interval;

  if (card == null) {
    card = { streak: 0, eFactor: 2.5, interval: 0.0 };
  }

  if (card.streak < 3) {
    // Still in learning phase, so do not change eFactor
    eFactor = card.eFactor;

    if (evaluation.score < 3) {
      // Failed, so force re-review in 30 minutes and reset streak count
      streak = 0;
      interval = (30 * 1.0) / (24.0 * 60.0);
    } else {
      streak = card.streak + 1;

      // first interval = 30min
      // second interval = 12h
      // third interval = 24h
      if (streak == 1) {
        // in 30m
        interval = (30.0 * 1.0) / (24.0 * 60.0);
      } else if (streak == 2) {
        // in 12h
        interval = 0.5;
      } else {
        // in 1d
        interval = 1.0;
      }
    }
    // Add 10% "fuzz" to interval to avoid bunching up reviews
    interval = interval * (1.0 + Math.random() * 0.1);
  } else {
    // Reviewing phase

    if (evaluation.score < 3) {
      // Failed, so force re-review in 30 minutes and reset streak count
      streak = 0;
      interval = (30 * 1.0) / (24.0 * 60.0);

      // Reduce eFactor
      eFactor = Math.max(1.3, card.eFactor - 0.2);
    } else {
      // Passed, so adjust eFactor and compute interval

      // First see if this was done close to on time or late. We handle early reviews differently
      // because Fresh Cards allows you to review cards as many times as you'd like, outside of
      // the SRS schedule. See details below in the "early" section.

      if (evaluation.lateness >= -0.1) {
        // Review was not too early, so handle normally

        streak = card.streak + 1;

        var latenessScoreBonus = 0;
        var intervalAdjustment = 1.0;

        // If this review was done late and user still got it right, give a slight bonus to the score of up to 1.0.
        // This means if a card was hard to remember AND it was late, the eFactor should be unchanged. On the other
        // hand, if the card was easy, we should bump up the eFactor by even more than normal.
        if (evaluation.lateness >= 0.1 && evaluation.score >= 3.0) {
          // Lateness factor is a function of card interval length. The longer
          // card interval, the harder it is to get a lateness bonus.
          // This ranges from 0.0 to 1.0.
          let latenessFactor = Math.min(1.0, evaluation.lateness);

          // Score factor can range from 1.0 to 1.5
          let scoreFactor = 1.0 + (evaluation.score - 3.0) / 4.0;

          // Bonus can range from 0.0 to 1.0.
          latenessScoreBonus = 1.0 * latenessFactor * scoreFactor;
        } else {
          // Card wasn't late, so adjust differently

          if (evaluation.score >= 3.0 && evaluation.score < 4) {
            // hard card, so adjust interval slightly
            intervalAdjustment = 0.8;
          }
        }

        let adjustedScore = latenessScoreBonus + evaluation.score;
        eFactor = Math.max(
          1.3,
          card.eFactor +
            (0.1 - (5 - adjustedScore) * (0.08 + (5 - adjustedScore) * 0.02))
        );

        // Figure out interval. First review is in 1d, then 6d, then based on eFactor and card interval.
        if (card.streak == 0) {
          interval = 1;
        } else if (card.streak == 1) {
          interval = 6;
        } else {
          interval = Math.ceil(card.interval * intervalAdjustment * eFactor);
        }
      } else {
        // Card was reviewed "too early". Since Fresh Cards lets you review cards outside of the
        // SRS schedule, it takes a different approach to early reviews. It will not progress the SRS
        // schedule too quickly if you review early. If we didn't handle this case, what would happen
        // is if you review a card multiple times in the same day, it would progress the schedule and
        // might make the card due next in 30 days, which doesn't make sense. Just because you reviewed
        // it frequently doesn't mean you have committed to memory stronger. It still takes a few days
        // for it to sink it.

        // Therefore, what this section does is does a weighted average of the card interval
        // with the interval in the future had you reviewed it on time instead of early. The weighting
        // function gives greater weight to the card interval period if you review too early,
        // and as we approach the actual due date, we weight the next interval more. This ensures
        // we don't progress through the schedule too quickly if you review a card frequently.

        // Still increment the 'streak' value as it really has no effect on 'reviewing stage' cards.
        streak = card.streak + 1;

        // Figure out the weight for the card and next intervals.
        // First, normalize the lateness factor into a range of 0.0 to 1.0 instead of -1.0 to 0.0
        // (which indicates how early the review is).
        const earliness = 1.0 + evaluation.lateness;
        // min(e^(earlieness^2) - 1.0), 1.0) gives us a nice weighted curve. You can plot it on a
        // site like fooplot.com. As we get closer to the true deadline, the future is given more
        // weight.
        const futureWeight = Math.min(
          Math.exp(earliness * earliness) - 1.0,
          1.0
        );
        const currentWeight = 1.0 - futureWeight;

        // Next we take the score at this time and extrapolate what that score may be in the
        // future, using the weighting function. Essentially, if you reviewed 5.0 today, we will
        // decay that score down to a minimum of 3.0 in the future. Something easily remembered
        // now may not be easily remembered in the future.
        const predictedFutureScore =
          currentWeight * evaluation.score + futureWeight * 3.0;

        // Compute the future eFactor and interval using the future score
        const futureeFactor = Math.max(
          1.3,
          card.eFactor +
            (0.1 -
              (5 - predictedFutureScore) *
                (0.08 + (5 - predictedFutureScore) * 0.02))
        );
        var futureInterval;

        // Figure out interval. First review is in 1d, then 6d, then based on eFactor and card interval.
        if (card.streak == 0) {
          futureInterval = 1;
        } else if (card.streak == 1) {
          futureInterval = 6;
        } else {
          futureInterval = Math.ceil(card.interval * futureeFactor);
        }

        // Finally, combine the card and next eFactor and intervals
        eFactor = card.eFactor * currentWeight + futureeFactor * futureWeight;
        interval =
          card.interval * currentWeight + futureInterval * futureWeight;
      }

      // Add 5% "fuzz" to interval to avoid bunching up reviews
      interval = interval * (1.0 + Math.random() * 0.05);
    }
  }

  return { streak, eFactor, interval };
}

export { srsFunc };
