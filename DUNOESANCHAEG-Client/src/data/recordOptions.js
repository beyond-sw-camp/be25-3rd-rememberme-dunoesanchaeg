export const RECORD_LEVEL_OPTIONS = [
  { label: '좋음', value: 'GOOD', emoji: '😄' },
  { label: '보통', value: 'MID', emoji: '😶' },
  { label: '나쁨', value: 'BAD', emoji: '😡' },
];

export const DAILY_RECORD_FIELDS = [
  {
    key: 'sleep',
    title: '잠은 잘 주무셨나요?',
    required: true,
    placeholder: '예시) 밤에 잠이 잘 오지 않아 자주 깼어요.',
  },
  {
    key: 'mood',
    title: '오늘 기분은 어떠세요?',
    required: true,
    placeholder: '예시) 날씨가 좋아서 기분이 괜찮았어요.',
  },
  {
    key: 'meal',
    title: '식사는 잘 챙겨드셨나요?',
    required: true,
    placeholder: '예시) 아침은 못 먹었지만 점심, 저녁은 잘 챙겨 먹었어요.',
  },
  {
    key: 'exercise',
    title: '몸을 움직이는 활동은 어떠셨나요?',
    required: false,
    placeholder: '예시) 산책을 20분 정도 했어요.',
  },
  {
    key: 'social',
    title: '다른 사람들과의 만남이나 활동은 어떠셨나요?',
    required: false,
    placeholder: '예시) 가족과 통화해서 기분이 좋았어요.',
  },
];