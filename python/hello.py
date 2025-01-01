import pandas as pd
import numpy as np

date_range = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')

rates = np.random.randint(-10, 10, size=len(date_range))

df = pd.DataFrame({'date': date_range, 'rate': rates})

df.to_json('data.json', orient='records', date_format='iso')