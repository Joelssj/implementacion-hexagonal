def generate_weekly_prediction(emotions):
    """
    Genera una predicción basada en las emociones registradas.
    """
    from random import choice
    return [choice(emotions) for _ in range(7)]
