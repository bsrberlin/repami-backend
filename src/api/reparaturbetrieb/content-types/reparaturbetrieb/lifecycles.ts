export default {
  async afterUpdate(event) {
    const { result, params } = event;

    const populatedResult = await strapi.db
      .query("api::reparaturbetrieb.reparaturbetrieb")
      .findOne({
        where: { id: result.id },
        populate: { user: true },
      });

    if (
      result.publishedAt === null &&
      result.finalSend === true &&
      result.sendMail === false
    ) {
      try {
        await strapi.plugins["email"].services.email.send({
          to: process.env.HWK_MAIL, // process.env.HWK_MAIL, // comment in when smtp is configrued: E-Mail to HWK
          from: process.env.FROM_MAIL,
          subject: "Neues Profil wurde angelegt",
          html: `Hallo, <br> ein neues Profil wurde angelegt: <a href="${process.env.STRAPI_URL}/admin/content-manager/collection-types/api::reparaturbetrieb.reparaturbetrieb/${result.id}">${process.env.STRAPI_URL}/admin/content-manager/collection-types/api::reparaturbetrieb.reparaturbetrieb/${result.id}</a>`,
        });

        await strapi.db.query("api::reparaturbetrieb.reparaturbetrieb").update({
          where: { id: result.id },
          data: {
            sendMail: "true",
          },
        });
      } catch (err) {
        console.log(err);
      }
    } else if (
      result.finalSend === true &&
      result.sendMail === true &&
      result.publishedAt !== null &&
      result.updateMail === true
    ) {
      try {
        await strapi.plugins["email"].services.email.send({
          to: process.env.HWK_MAIL, // process.env.HWK_MAIL, // comment in when smtp is configrued: E-Mail to HWK
          from: process.env.FROM_MAIL,
          subject: "Profil wurde aktualisiert",
          html: `Hallo,<br> das folgende Profil wurde aktualisiert: <a href="${process.env.STRAPI_URL}/admin/content-manager/collection-types/api::reparaturbetrieb.reparaturbetrieb/${result.id}">${process.env.STRAPI_URL}/admin/content-manager/collection-types/api::reparaturbetrieb.reparaturbetrieb/${result.id}</a>
          <br><br>
          Bitte beachten: Es ist wichtig zu prüfen, ob die Daten der Adress-Felder mit dem Location-Feld übereinstimmen. Im Fall einer Adressänderung ist es ansonsten notwendig das Location-Feld manuell an die neue Adresse anzupassen.
          `,
        });
      } catch (err) {
        console.log(err);
      }
    } else if (
      params.data?.publishedAt !== undefined &&
      result.createdByReaperaturbetrieb === true &&
      result.finalSend === true &&
      result.updateMail !== true
    ) {
      try {
        await strapi.plugins["email"].services.email.send({
          to: populatedResult.user.username, // comment in when smtp is configrued: populatedResult.user.username
          from: process.env.FROM_MAIL,
          subject: "Netzwerk Qualitätsreparatur – Dein Profil ist online",
          html: `Lieber reparierender Handwerksbetrieb,<br>
                <br>
                wir freuen uns, dass du ein Profil auf der Internetseite unseres Netzwerks erstellt hast.<br>
                Nun können dich die Berlinerinnen und Berliner auf unserer Seite finden, mit einer qualitativ hochwertigen Reparatur beauftragen und damit einem Produkt die Chance auf ein zweites Leben geben.\n
                Du hast jederzeit die Möglichkeit, Veränderungen an deinem Profil vorzunehmen.<br>
                <br>
                <a href="${process.env.FRONTEND_URL}/reparaturbetriebsprofil/${result.id}">${process.env.FRONTEND_URL}/reparaturbetriebsprofil/${result.id}</a><br>
                <br>
                Wenn du einen Reparaturbetrieb kennst, der auch auf unserer Plattform vertreten sein sollte, mache ihn gerne auf unser Angebot aufmerksam. 
                Bei Fragen stehen wir gerne per <a href="mailto:${process.env.FROM_MAIL}">E-Mail</a> zur Verfügung.<br>
                <br>
                Liebe Grüße<br>
                repami - Netzwerk Qualitätsreparatur`,
        });
      } catch (err) {
        console.log(err);
      }
    } else if (
      params.data?.publishedAt !== undefined &&
      result.createdByReaperaturbetrieb === false &&
      result.finalSend === false &&
      result.updateMail !== true
    ) {
      try {
        await strapi.plugins["email"].services.email.send({
          to: populatedResult.user.username, // comment in when smtp is configrued: populatedResult.user.username
          from: process.env.FROM_MAIL,
          subject: "Netzwerk Qualitätsreparatur – Dein Profil ist online",
          html: `Lieber reparierender Handwerksbetrieb,<br>
                <br>
                wir freuen uns, dass du nun mit deinem Profil auf der Internetseite unseres Netzwerks vertreten bist.\n
                Nun können dich die Berlinerinnen und Berliner auf unserer Seite finden, mit einer qualitativ hochwertigen Reparatur beauftragen und damit einem Produkt die Chance auf ein zweites Leben geben.<br>
                Du hast jetzt die Möglichkeit, selbst Veränderungen an deinem Profil vorzunehmen.\n
                Gehe dazu bitte auf den unteren Link und erstelle dir mit „Passwort vergessen“ ein eigenes sicheres Passwort. Dort kannst du deine Daten einsehen und bei Bedarf Änderungen jederzeit selber vornehmen.<br>
                <br>
                <a href="${process.env.FRONTEND_URL}/reparaturbetriebsprofil/${result.id}">${process.env.FRONTEND_URL}/reparaturbetriebsprofil/${result.id}<br></a>
                <br>
                Wenn du einen Reparaturbetrieb kennst, der auch auf unserer Plattform vertreten sein sollte, mache ihn gerne auf unser Angebot aufmerksam.<br>
                Bei Fragen stehen wir gerne per E-Mail (LINK) zur Verfügung.<br>
                <br>
                Liebe Grüße<br>
                repami - Netzwerk Qualitätsreparatur`,
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
};
