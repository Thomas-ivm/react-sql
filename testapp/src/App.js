import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  IntlProvider,
  FormattedMessage,
  FormattedList,
  useIntl,
} from "react-intl";


let initLocale = "en";
if (navigator.language === "nl") {
  initLocale = "nl";
} else if (navigator.language === "de") {
  initLocale = "de";
}

function loadMessages(locale) {
  switch (locale) {
    case "en":
      return import("./lang/en.json");
    case "nl":
      return import("./lang/nl.json");
    case "de":
      return import("./lang/de.json");
    default:
      return import("./lang/en.json");
  }
}

function LocalizationWrapper() {
  const [locale, setLocale] = useState('nl'); // Set initial locale
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    loadMessages(locale).then(loadedMessages => {
      setMessages(loadedMessages.default); // Assuming your JSON files export default
    });
  }, [locale]); // Dependency array to trigger on locale change

  return (
    <IntlProvider locale={locale} messages={messages}>
      {messages ? <App locale={locale} onLocaleChange={setLocale} /> : null}
    </IntlProvider>
  );
}
export default LocalizationWrapper;

function App({ locale, direction, onLocaleChange }) {
  const [data, setData] = useState([])
  const intl = useIntl();
  useEffect(() => {
    fetch('http://localhost:8081/gegevens')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <div>{intl.formatMessage({ id: "message.abreact" })}</div>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {intl.formatMessage({ id: "message.reactlink" })}
        </a>
        <table>
          <div style={{ textAlign: "center" }}>
            <select value={locale} onChange={(e) => onLocaleChange(e.target.value)}>
              <option value="en">en</option>
              <option value="nl">nl</option>
              <option value="de">de</option>
            </select>
          </div>
          <div className='thead' dir={direction} style={{ padding: 20 }} data-testid="examples">
            {intl.formatMessage({ id: "message.fname" })}
            {intl.formatMessage({ id: "message.lname" })}
            {intl.formatMessage({ id: "message.age" })}
            {intl.formatMessage({ id: "message.city" })}
          </div>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.vnaam}</td>
                <td>{d.anaam}</td>
                <td>{d.leeftijd}</td>
                <td>{d.stad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
      <main>
        <div>
        </div>
      </main>
    </div>
  );
}

// export default App;
