import React, { useContext, useMemo } from 'react';
import { ScrollView, Text, StyleSheet, View, Linking } from 'react-native';
import { ThemeContext } from '../../state/theme/ThemeContext';
import { utils } from '../../utils';
import { themeStyles } from '../../themeStyles';

const tableData = [
  [
    'Google',
    'Email, marketing',
    'http://www.google.com/intl/en/policies/privacy/'
  ],
  ['Facebook', 'Marketing', 'https://www.facebook.com/privacy/explanation'],
  [
    'Intercom',
    'Student relationship management',
    'https://www.intercom.com/legal/terms-and-policies'
  ],
  [
    'Maropost',
    'Student relationship management',
    'https://www.maropost.com/privacy-policy/'
  ],
  ['Stripe', 'Payment processor', 'https://stripe.com/en-ca/privacy'],
  [
    'Paypal',
    'Payment processor',
    'https://www.paypal.com/ca/webapps/mpp/ua/privacy-full?locale.x=en_CA'
  ],
  ['Typeform', 'Student surveys', 'https://admin.typeform.com/to/dwk6gt/'],
  ['Unbounce', 'Marketing landing pages', 'https://unbounce.com/privacy/'],
  [
    'Bonjoro',
    'Student relationship management',
    'https://www.bonjoro.com/privacy-policy'
  ]
];

interface Props {
  from?: string;
}

export const PrivacyPolicy: React.FC<Props> = ({ from }) => {
  const { theme } = useContext(ThemeContext);

  const styles = useMemo(() => setStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginLeft: 15, paddingRight: 15 }}>
        {!from && <Text style={styles.pageTitle}>Privacy Policy</Text>}
        <Text
          style={[
            styles.text,
            {
              textAlign: 'center'
            }
          ]}
        >
          Last updated: September 2020
        </Text>
        <Text style={styles.text}>
          Musora Media Inc., (“Company”,” us", "we", or "our") operates the
          drumeo.com, pianote.com, and guitareo.com website (the "Service").
          {`\n\n`}
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal data when you elect to use our Service,
          along with the choices you have associated with that data.
          {`\n\n`}
          We use your and others’ data to provide and improve the Service. By
          using the Service, you agree to our collection and use of information
          as described in this policy. In order for us to improve the Service,
          we rely on the collection and use of this information. Unless
          otherwise defined in this Privacy Policy, terms used in this Privacy
          Policy have the same meanings as in our Terms and Conditions,
          accessible from{' '}
          <Text
            onPress={() => {
              // TBD
              //   navigate('termsOfUse');
            }}
            style={[
              styles.text,
              {
                color: utils.color
              }
            ]}
          >
            here.
          </Text>
        </Text>
        <Text
          style={[
            styles.boldText,
            {
              textAlign: 'center'
            }
          ]}
        >
          Definitions
        </Text>
        <Text style={styles.subtitle}>Personal Data</Text>
        <Text style={styles.text}>
          Personal Data means data about a natural, living person who may be
          identified from such data (or from those and other information either
          in our possession or likely to come into our possession).
        </Text>
        <Text style={styles.subtitle}>Usage Data</Text>
        <Text style={styles.text}>
          Usage Data is data collected automatically either generated by the use
          of the Service or from the Service infrastructure itself (for example,
          the duration of a page visit, browser identification, etc).
        </Text>
        <Text style={styles.subtitle}>Cookies</Text>
        <Text style={styles.text}>
          Cookies are small amounts of data stored on a User’s device when he or
          she visits certain websites.
        </Text>
        <Text style={styles.subtitle}>Data Controller</Text>
        <Text style={styles.text}>
          Data Controller means a person who (either alone or jointly or in
          common with other persons) determines whether and how any personal
          data are processed, and the purposes of such processing.{`\n\n`}
          For the purpose of this Privacy Policy, we are a Data Controller of
          your data.
        </Text>
        <Text style={styles.subtitle}>
          Data Processor (or Service Providers)
        </Text>
        <Text style={styles.text}>
          Data Processor (or Service Provider) means any company or person
          (other than an employee of the Data Controller) who processes the data
          on behalf of the Data Controller.{`\n\n`}
          We use various Service Providers in order to process your data more
          effectively.
        </Text>
        <Text style={styles.subtitle}>Data Subject</Text>
        <Text style={styles.text}>
          A Data Subject is any living individual who is the subject of Personal
          Data.
        </Text>
        <Text style={styles.subtitle}>User</Text>
        <Text style={styles.text}>
          A User is the individual who uses our Service. The User corresponds to
          the Data Subject, who is the subject of Personal Data.
        </Text>
        <Text
          style={[
            styles.boldText,
            {
              textAlign: 'center'
            }
          ]}
        >
          Information Collection and Use
        </Text>
        <Text style={styles.text}>
          We collect different types of information for various purposes to
          provide and improve our Service to you.
        </Text>
        <Text style={styles.bigSubtitle}>Types of Data Collected</Text>
        <Text style={styles.boldText}>Personal Data</Text>
        <Text style={styles.text}>
          While using our Service, we may ask you to provide us with certain
          personally identifiable information that may be used to contact or
          identify you ("Personal Data"). Users can provide Personal Data not
          only for us, but for other members in the community across any and all
          of our Services. Personally, identifiable information may include, but
          is not limited to:
        </Text>
        <Text style={styles.text}>
          {'  \u2B24'} Email address{`\n`}
          {'  \u2B24'} First name and last name{`\n`}
          {'  \u2B24'} Phone number{`\n`}
          {'  \u2B24'} Gender{`\n`}
          {'  \u2B24'} Avatar photo{`\n`}
          {'  \u2B24'} Birthday{`\n`}
          {'  \u2B24'} Address, State, Province, ZIP/Postal code, City{`\n`}
          {'  \u2B24'} Other biographical information{`\n`}
          {'  \u2B24'} Cookies and Usage Data{`\n`}
          {'  \u2B24'} Music equipment preferences{`\n\n`}
          We may use your Personal Data to contact you with newsletters,
          marketing or promotional materials and other information that may be
          of interest to you. You may opt-out of receiving any, or all, of these
          communications from us by following the unsubscribe link or
          instructions provided in any email we send or by contacting us.
          {`\n\n`}
          We also collect certain Personal Data from users who are accessing our
          Services through websites under our control offering free lessons.
          This Personal Data is subject to the same terms and conditions in this
          Privacy Policy.
        </Text>
        <Text style={styles.boldText}>Usage Data</Text>
        <Text style={styles.text}>
          We may also collect information regarding how the Service is accessed
          and used ("Usage Data"). This Usage Data may include information such
          as your computer's Internet Protocol address (e.g. IP address),
          browser type, browser version, the pages of our Service that you
          visit, the time and date of your visit, the time spent on those pages,
          any linked devices that you may own that use our Services, purchase
          history, geographic location, unique device identifiers and other
          diagnostic data.
        </Text>
        <Text style={styles.boldText}>Tracking Cookies Data</Text>
        <Text style={styles.text}>
          We use cookies and similar tracking technologies to track the activity
          on our Service and hold certain information.{`\n\n`}
          Cookies are files with a small amount of data which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          website and stored on your device. Tracking technologies also used are
          beacons, tags, and scripts to collect and track information and to
          improve and analyze our Service.{`\n\n`}
          You may instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our Service.{`\n\n`}
          Examples of Cookies we use:{`\n\n`}
          {'  \u2B24'}{' '}
          <Text style={styles.smallBoldText}>Session Cookies.</Text> We use
          Session Cookies to operate our Service.
          {`\n`}
          {'  \u2B24'}{' '}
          <Text style={styles.smallBoldText}>Preference Cookies.</Text> We use
          Preference Cookies to remember your preferences and various settings.
          {`\n`}
          {'  \u2B24'}{' '}
          <Text style={styles.smallBoldText}>Security Cookies.</Text> We use
          Security Cookies for security purposes.
          {`\n`}
          {'  \u2B24'}{' '}
          <Text style={styles.smallBoldText}>Authentication Cookies.</Text> We
          use Authentication Cookies for members within our platforms.
          {`\n`}
        </Text>
        <Text style={styles.bigSubtitle}>Use of Data</Text>
        <Text style={styles.text}>
          Company uses the collected data for various purposes:
        </Text>
        <Text style={styles.text}>
          {'  \u2B24'} To provide and maintain our Service{`\n`}
          {'  \u2B24'} To notify you about changes to our Service{`\n`}
          {'  \u2B24'} To allow you to participate in interactive features of
          our Service when you choose to do so{`\n`}
          {'  \u2B24'} To provide customer support{`\n`}
          {'  \u2B24'} To gather analysis or valuable information so that we may
          improve our Service{`\n`}
          {'  \u2B24'} To monitor the usage of our Service{`\n`}
          {'  \u2B24'} To detect, prevent and address technical issues{`\n`}
          {'  \u2B24'} To provide you with news, special offers and general
          information about other goods, services and events which we offer that
          are similar to those that you have already purchased or enquired about
          unless you have opted not to receive such information{`\n`}
        </Text>
        <Text style={styles.bigSubtitle}>Retention of Data</Text>
        <Text style={styles.text}>
          Company will retain your Personal Data only for as long as is
          necessary for the purposes set out in this Privacy Policy. We will
          retain and use your Personal Data to the extent necessary to comply
          with our legal obligations (for example, if we are required to retain
          your data to comply with applicable laws), resolve disputes, and
          enforce our legal agreements and policies.{`\n\n`}
          Company will also retain Usage Data for internal analysis purposes.
          Usage Data is generally retained for a shorter period of time, except
          when this data is used to strengthen the security or to improve the
          functionality of our Service, or we are legally obligated to retain
          this data for longer time periods.
        </Text>
        <Text style={styles.bigSubtitle}>Transfer Of Data</Text>
        <Text style={styles.text}>
          Your information, including Personal Data, may be transferred to — and
          maintained on — computers located outside of your state, province,
          country or other governmental jurisdiction where the data protection
          laws may differ than those from your jurisdiction.{`\n\n`}
          If you are located outside the state of Ohio, USA, and choose to
          provide information to us, please note that we transfer the data,
          including Personal Data, to our servers and data stores in Ohio, USA,
          and process it there.{`\n\n`}
          Your consent to this Privacy Policy followed by your submission of
          such information represents your agreement to that transfer.{`\n\n`}
          Company will take all steps reasonably necessary to ensure that your
          data is treated securely and in accordance with this Privacy Policy
          and no transfer of your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of your data and other personal information.
        </Text>
        <Text style={styles.bigSubtitle}>Disclosure Of Data</Text>
        <Text style={styles.subtitle}>Business Transaction</Text>
        <Text style={styles.text}>
          If Company is involved in a merger, acquisition or asset sale, your
          Personal Data may be transferred. We will provide notice before your
          Personal Data is transferred and becomes subject to a different
          Privacy Policy.
        </Text>
        <Text style={styles.subtitle}>Disclosure for Law Enforcement</Text>
        <Text style={styles.text}>
          Under certain circumstances, Company may be required to disclose your
          Personal Data if required to do so by law or in response to valid
          requests by public authorities (e.g. a court or a government agency).
        </Text>
        <Text style={styles.subtitle}>Legal Requirements</Text>
        <Text style={styles.text}>
          Company may disclose your Personal Data in the good faith belief that
          such action is necessary to:{`\n`}
          {'  \u2B24'} To comply with a legal obligation{`\n`}
          {'  \u2B24'} To protect and defend the rights or property of Company
          {`\n`}
          {'  \u2B24'} To prevent or investigate possible wrongdoing in
          connection with the Service{`\n`}
          {'  \u2B24'} To protect the personal safety of users of the Service or
          the public{`\n`}
          {'  \u2B24'} To protect against legal liability
        </Text>
        <Text style={styles.bigSubtitle}>Security Of Data</Text>
        <Text style={styles.text}>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet, or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </Text>
        <Text style={styles.bigSubtitle}>"Do Not Track" Signals</Text>
        <Text style={styles.text}>
          We do not support Do Not Track ("DNT"). Do Not Track is a preference
          you may set in your web browser to inform websites that you do not
          want to be tracked.{`\n\n`}
          You may enable or disable Do Not Track by visiting the Preferences or
          Settings page of your web browser.
        </Text>
        <Text style={styles.bigSubtitle}>Your Rights</Text>
        <Text style={styles.text}>
          Company aims to take reasonable steps to allow you to correct, amend,
          delete, or limit the use of your Personal Data.{`\n\n`}
          Whenever made possible, you may update your Personal Data directly
          within your account settings section. If you are unable to change your
          Personal Data, please contact us to make the required changes.{`\n\n`}
          If you wish to be informed of what Personal Data we hold about you and
          if you want it to be removed from our systems, please contact us.
          {`\n\n`}
          In certain circumstances, you have the right:{`\n\n`}
          {'  \u2B24'} To access and receive a copy of the Personal Data we hold
          about you{`\n`}
          {'  \u2B24'} To rectify any Personal Data held about you that is
          inaccurate{`\n`}
          {'  \u2B24'} To request the deletion of Personal Data held about you
          {`\n`}
          You have the right to data portability for the information you provide
          to Company. You may request to obtain a copy of your Personal Data in
          a commonly used electronic format so that you may manage and move it.{' '}
          {`\n\n`}
          Please note that we may ask you to verify your identity before
          responding to such requests.
        </Text>
        <Text style={styles.bigSubtitle}>Service Providers</Text>
        <Text style={styles.text}>
          We may employ third party companies and individuals to facilitate our
          Service ("Service Providers"), to provide the Service on our behalf,
          to perform Service-related services or to assist us in analyzing how
          our Service is used.{`\n\n`}
          These third parties have access to your Personal Data only to perform
          these tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </Text>
        <Text style={styles.subtitle}>Analytics</Text>
        <Text style={styles.text}>
          We may use third-party Service Providers to monitor and analyze the
          use of our Service.
        </Text>
        <Text style={[styles.smallBoldText, { paddingLeft: 20 }]}>
          Google Marketing Platform
        </Text>
        <Text
          style={[
            styles.text,
            {
              paddingLeft: 20
            }
          ]}
        >
          Google Marketing Platform is an advertising and analytics platform
          offered by Google that tracks and reports website traffic. Google uses
          the data collected to track and monitor the use of our Service. This
          data is shared with other Google services. Google may use the
          collected data to contextualize and personalize the ads of its own
          advertising network.{`\n\n`}
          You may opt-out of having made your activity on the Service available
          to Google Marketing Platform by visiting the Google Marketing Platform
          opt-out page or the Network Advertising Initiative opt-out page.
          Additionally, you may opt-out by installing the Google Analytics
          opt-out browser add-on. The add-on prevents the Google Analytics
          JavaScript (ga.js, analytics.js, and dc.js) from sharing information
          with Google Analytics about visits activity.{`\n\n`}
          For more information on the privacy practices of Google, please visit
          the Google Privacy Terms web page:{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL(
                'https://www.google.com/intl/en/policies/privacy/'
              )
            }
          >
            http://www.google.com/intl/en/policies/privacy/
          </Text>
        </Text>
        <Text style={styles.subtitle}>Behavioral Remarketing</Text>
        <Text style={styles.text}>
          Company uses remarketing services to advertise on third party websites
          to you after you visited our Service. We and our third-party vendors
          use cookies to inform, optimize and serve ads based on your past
          visits to our Service.
        </Text>
        <Text style={[styles.smallBoldText, { paddingLeft: 20 }]}>
          Google AdWords
        </Text>
        <Text
          style={[
            styles.text,
            {
              paddingLeft: 20
            }
          ]}
        >
          Google AdWords remarketing service is provided by Google Inc.{`\n\n`}
          You may opt-out of Google Analytics for Display Advertising and
          customize the Google Display Network ads by visiting the Google Ads
          Settings page:{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL('http://www.google.com/settings/ads')
            }
          >
            http://www.google.com/settings/ads
          </Text>
          {`\n\n`}
          Google also recommends installing the Google Analytics Opt-out Browser
          Add-on -{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL('https://tools.google.com/dlpage/gaoptout')
            }
          >
            https://tools.google.com/dlpage/gaoptout
          </Text>{' '}
          - for your web browser. Google Analytics Opt-out Browser Add-on
          provides visitors with the ability to prevent their data from being
          collected and used by Google Analytics.{`\n\n`}
          For more information on the privacy practices of Google, please visit
          the Google Privacy Terms web page:{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL('http://www.google.com/intl/en/policies/privacy/')
            }
          >
            http://www.google.com/intl/en/policies/privacy/
          </Text>
        </Text>
        <Text style={[styles.smallBoldText, { paddingLeft: 20 }]}>
          Facebook
        </Text>
        <Text
          style={[
            styles.text,
            {
              paddingLeft: 20
            }
          ]}
        >
          Facebook remarketing service is provided by Facebook Inc.{`\n\n`}
          You may learn more about interest-based advertising from Facebook by
          visiting this page:{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL('https://www.facebook.com/help/164968693837950')
            }
          >
            https://www.facebook.com/help/164968693837950
          </Text>
          {`\n\n`}
          To opt-out from Facebook's interest-based ads follow these
          instructions from Facebook:{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL('https://www.facebook.com/help/568137493302217')
            }
          >
            https://www.facebook.com/help/568137493302217
          </Text>
          {`\n\n`}
          Facebook adheres to the Self-Regulatory Principles for Online
          Behavioral Advertising established by the Digital Advertising
          Alliance. You may also opt-out from Facebook and other participating
          companies through the Digital Advertising Alliance in the USA{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() => Linking.openURL('http://www.aboutads.info/choices')}
          >
            http://www.aboutads.info/choices/
          </Text>{' '}
          , the Digital Advertising Alliance of Canada in Canada{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() => Linking.openURL('http://youradchoices.ca/')}
          >
            http://youradchoices.ca/
          </Text>{' '}
          or the European Interactive Digital Advertising Alliance in Europe{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() => Linking.openURL('http://www.youronlinechoices.eu/')}
          >
            http://www.youronlinechoices.eu/
          </Text>
          , or opt-out using your mobile device settings.{`\n\n`}
          For more information on the privacy practices of Facebook, please
          visit Facebook's Data Policy:{' '}
          <Text
            style={{ color: utils.color }}
            onPress={() =>
              Linking.openURL('https://www.facebook.com/privacy/explanation')
            }
          >
            https://www.facebook.com/privacy/explanation
          </Text>
        </Text>
        <Text style={styles.smallBoldText}>Other Third-Party Services</Text>
        <Text style={styles.text}>
          We use additional third-party services to facilitate the Services on
          your behalf. For more information on the privacy practices of each of
          these Third-Party services, we have provided hyperlinks for your
          convenience.{' '}
        </Text>
        <Text style={styles.boldText}>Services</Text>
        {tableData.map((td, index) => (
          <React.Fragment key={index}>
            <Text style={[styles.smallBoldText, { paddingTop: 10 }]}>
              {'  '}
              {td[0]}
            </Text>
            <Text style={[styles.smallBoldText, { paddingTop: 10 }]}>
              {'    '}Service Provided: <Text style={styles.text}>{td[1]}</Text>
            </Text>
            <Text style={styles.smallBoldText}>
              {'    '}Terms & Privacy:{' '}
              <Text
                style={{ color: utils.color, fontFamily: 'OpenSans' }}
                onPress={() => Linking.openURL(td[2])}
              >
                {td[2]}
              </Text>
            </Text>
          </React.Fragment>
        ))}
        <Text style={styles.bigSubtitle}>
          {`\n\n`}
          Links To Other Sites
        </Text>
        <Text style={styles.text}>
          Our Service may contain links to other sites that are not operated by
          us. If you click on a third party link, you will be directed to that
          third party's site. We strongly advise you to review the Privacy
          Policy of every site you visit.{`\n\n`}
          We have no control over and assume no responsibility for the content,
          privacy policies or practices of any third-party sites or services.
        </Text>
        <Text style={styles.bigSubtitle}>Children's Privacy</Text>
        <Text style={styles.text}>
          Our Service does not address anyone under the age of 18 ("Children").
          {`\n\n`}
          We do not knowingly collect personally identifiable information from
          anyone under the age of 18. If you are a parent or guardian and you
          are aware that your Children has provided us with Personal Data,
          please contact us. If we become aware that we have collected Personal
          Data from children without verification of parental consent, we take
          steps to remove that information from our servers.
        </Text>
        <Text style={styles.bigSubtitle}>Changes To This Privacy Policy</Text>
        <Text style={styles.text}>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.{`\n\n`}
          We will let you know via email and/or a prominent notice on our
          Service, prior to the change becoming effective and update the
          "effective date" at the top of this Privacy Policy.{`\n\n`}
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </Text>
        <Text style={styles.bigSubtitle}>Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us
          at {`support@${utils.brand}.com`}.
        </Text>
      </ScrollView>
    </View>
  );
};

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: current.background
    },
    title: {
      marginTop: 20,
      marginBottom: 10
    },
    subtitle: {
      marginBottom: 10,
      fontSize: utils.figmaFontSizeScaler(14),
      fontFamily: 'OpenSans-BoldItalic',
      color: current.textColor
    },
    bigSubtitle: {
      marginBottom: 10,
      fontSize: utils.figmaFontSizeScaler(18),
      fontFamily: 'OpenSans-BoldItalic',
      color: current.textColor
    },
    text: {
      fontFamily: 'OpenSans',
      fontSize: utils.figmaFontSizeScaler(12),
      marginBottom: 10,
      color: current.textColor
    },
    smallBoldText: {
      marginBottom: 10,
      fontSize: utils.figmaFontSizeScaler(12),
      fontFamily: 'OpenSans-Bold',
      color: current.textColor
    },
    boldText: {
      marginBottom: 10,
      fontSize: utils.figmaFontSizeScaler(16),
      fontFamily: 'OpenSans-Bold',
      color: current.textColor
    },
    tableHead: {
      height: 40,
      backgroundColor: current.background
    },
    tableText: {
      margin: 2,
      backgroundColor: current.background,
      fontFamily: 'OpenSans',
      color: current.textColor
    },
    tableLink: {
      margin: 2,
      backgroundColor: current.background,
      fontFamily: 'OpenSans',
      color: utils.color
    },
    tableHeadText: {
      margin: 2,
      fontFamily: 'OpenSans-Bold',
      color: current.textColor
    },
    row: { flexDirection: 'row' },
    pageTitle: {
      fontSize: utils.figmaFontSizeScaler(30),
      fontFamily: 'OpenSans-Bold',
      marginTop: 20,
      marginBottom: 10,
      textAlign: 'center',
      color: current.textColor
    }
  });
