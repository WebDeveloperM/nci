import './JsonView.css'

const HIDDEN_KEYS = ['success', 'succes', 'status']

const KEY_LABELS = {
  Code: 'Код',
  Name: 'Наименование',
  EdIzm: 'Ед. изм.',
  Klass: 'Класс',
  NameFull: 'Полное наименование',
  Foto: 'Фото',
}

const DOP_DATA_KEY_REGEX = /^DopData\d+$/

function buildPhotoUrl(base64) {
  if (base64.startsWith('data:')) return base64
  return `data:image/jpeg;base64,${base64}`
}

function JsonValue({ value }) {
  if (value === null || value === undefined) {
    return <span className="json-value json-empty">—</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="json-value json-empty">[]</span>
    return (
      <ul className="json-list">
        {value.map((item, index) => (
          <li key={index}>
            <JsonValue value={item} />
          </li>
        ))}
      </ul>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .filter(([key]) => !HIDDEN_KEYS.includes(key.toLowerCase()))
      .sort(([a], [b]) => (a === 'Foto' ? -1 : b === 'Foto' ? 1 : 0))
    if (entries.length === 0) return <span className="json-value json-empty">{'{}'}</span>

    const regularEntries = entries.filter(([key]) => !DOP_DATA_KEY_REGEX.test(key))
    const dopDataEntries = entries.filter(([key]) => DOP_DATA_KEY_REGEX.test(key))

    return (
      <dl className="json-object">
        {regularEntries.map(([key, val]) => (
          <div className="json-row" key={key}>
            <dt>{KEY_LABELS[key] ?? key}</dt>
            <dd>
              {key === 'Foto' && typeof val === 'string' && val ? (
                <div className="json-photo-row">
                  <img className="json-photo" src={buildPhotoUrl(val)} alt="Foto" />
                </div>
              ) : (
                <JsonValue value={val} />
              )}
            </dd>
          </div>
        ))}
        {dopDataEntries.length > 0 && (
          <div className="json-row">
            <dt>Дополнительные данные</dt>
            <dd>
              <ul className="json-dopdata-list">
                {dopDataEntries.map(([key, val]) => (
                  <li key={key}>
                    <JsonValue value={val} />
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    )
  }

  return <span className="json-value">{String(value)}</span>
}

function JsonView({ data }) {
  return <JsonValue value={data} />
}

export default JsonView
