class Emotion:
    def __init__(self, user_uuid, feeling):
        self.user_uuid = user_uuid
        self.feeling = feeling

    def to_dict(self):
        return {"user_uuid": self.user_uuid, "feeling": self.feeling}
