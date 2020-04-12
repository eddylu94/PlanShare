import React from "react";

interface ITermsOfUseProps {
  setIsTermsOfUseDialogDisplayed: (value: boolean) => void;
  setTermsOfUseAcknowledged: (value: boolean) => void;
}

const TermsOfUseDialog = (
  props: { dismissTermsOfUseDialog: () => void } & ITermsOfUseProps
) => {
  const { dismissTermsOfUseDialog, setTermsOfUseAcknowledged } = props;

  const handleDeclineTerms = () => {
    setTermsOfUseAcknowledged(false);
    dismissTermsOfUseDialog();
  };

  const handleAcceptTerms = () => {
    setTermsOfUseAcknowledged(true);
    dismissTermsOfUseDialog();
  };

  return (
    <div className="terms-of-use-container">
      <div className="terms-of-use-dialog">
        <div className="terms-of-use-wrapper">
          <h3 className="terms-of-use-header">Terms of Use</h3>
          <div className="terms-of-use-content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Mattis
              enim ut tellus elementum sagittis vitae et leo duis. A diam
              maecenas sed enim ut sem viverra. Mauris ultrices eros in cursus.
              Vitae suscipit tellus mauris a diam maecenas. Dolor magna eget est
              lorem ipsum dolor sit. Dictumst vestibulum rhoncus est
              pellentesque elit. Sit amet commodo nulla facilisi nullam. Sit
              amet purus gravida quis blandit turpis cursus. Morbi blandit
              cursus risus at ultrices mi. In aliquam sem fringilla ut morbi
              tincidunt augue interdum. Id aliquet lectus proin nibh nisl
              condimentum id venenatis a. In ante metus dictum at. Aliquet nec
              ullamcorper sit amet risus nullam eget. Proin libero nunc
              consequat interdum varius sit amet mattis vulputate. Lorem sed
              risus ultricies tristique nulla aliquet. Nam aliquam sem et tortor
              consequat id porta nibh.
            </p>
            <p>
              Hac habitasse platea dictumst vestibulum rhoncus. Massa sed
              elementum tempus egestas sed. Metus aliquam eleifend mi in nulla.
              Ornare arcu odio ut sem. Dictum non consectetur a erat. In hac
              habitasse platea dictumst quisque sagittis purus sit amet. Orci
              nulla pellentesque dignissim enim sit amet venenatis urna cursus.
              Erat pellentesque adipiscing commodo elit at imperdiet dui
              accumsan. Amet nisl suscipit adipiscing bibendum. Risus quis
              varius quam quisque id diam vel quam elementum. Viverra vitae
              congue eu consequat ac felis. Vulputate enim nulla aliquet
              porttitor. Iaculis urna id volutpat lacus laoreet.
            </p>
            <p>
              Proin nibh nisl condimentum id venenatis a condimentum vitae.
              Maecenas accumsan lacus vel facilisis. Diam vel quam elementum
              pulvinar etiam. In est ante in nibh. Faucibus pulvinar elementum
              integer enim. Neque sodales ut etiam sit amet nisl. Imperdiet
              nulla malesuada pellentesque elit eget gravida cum. Aliquam
              vestibulum morbi blandit cursus. Diam ut venenatis tellus in
              metus. Adipiscing elit duis tristique sollicitudin nibh. Dignissim
              sodales ut eu sem integer vitae. Velit aliquet sagittis id
              consectetur. Aliquam nulla facilisi cras fermentum. Amet mauris
              commodo quis imperdiet massa tincidunt nunc. Arcu non sodales
              neque sodales. Est sit amet facilisis magna. Sit amet luctus
              venenatis lectus magna. Sed vulputate odio ut enim blandit
              volutpat maecenas volutpat. Id venenatis a condimentum vitae
              sapien. A lacus vestibulum sed arcu non.
            </p>
            <p>
              Ut ornare lectus sit amet est. Blandit libero volutpat sed cras.
              Iaculis nunc sed augue lacus viverra. Auctor eu augue ut lectus
              arcu bibendum at varius vel. Adipiscing elit ut aliquam purus sit
              amet luctus venenatis lectus. Phasellus egestas tellus rutrum
              tellus pellentesque eu tincidunt tortor aliquam. Viverra vitae
              congue eu consequat ac. Duis at consectetur lorem donec massa.
              Tellus elementum sagittis vitae et leo duis ut diam quam. Aliquet
              nibh praesent tristique magna sit amet purus. Eget gravida cum
              sociis natoque penatibus et magnis. Pellentesque diam volutpat
              commodo sed egestas. Donec ac odio tempor orci dapibus ultrices.
              Porttitor rhoncus dolor purus non enim. Lectus vestibulum mattis
              ullamcorper velit sed ullamcorper morbi tincidunt ornare. Quis
              blandit turpis cursus in hac habitasse. Aenean et tortor at risus
              viverra. Tempor id eu nisl nunc mi. In arcu cursus euismod quis.
            </p>
            <p>
              Aliquet nibh praesent tristique magna sit amet purus gravida.
              Justo laoreet sit amet cursus sit amet. Nascetur ridiculus mus
              mauris vitae ultricies leo. Tellus molestie nunc non blandit massa
              enim nec dui. Leo in vitae turpis massa sed elementum tempus
              egestas. Elementum facilisis leo vel fringilla est ullamcorper
              eget nulla. Aliquet lectus proin nibh nisl condimentum id
              venenatis a condimentum. Porta nibh venenatis cras sed felis. Et
              odio pellentesque diam volutpat. Porttitor leo a diam sollicitudin
              tempor id eu nisl. Ac placerat vestibulum lectus mauris ultrices
              eros in. Ipsum dolor sit amet consectetur adipiscing elit duis
              tristique. Ullamcorper sit amet risus nullam eget. Gravida cum
              sociis natoque penatibus et magnis dis. Faucibus turpis in eu mi
              bibendum neque egestas.
            </p>
            <p>
              Lacinia at quis risus sed vulputate odio ut enim blandit. Vel elit
              scelerisque mauris pellentesque pulvinar pellentesque. Egestas
              pretium aenean pharetra magna ac. Suspendisse in est ante in nibh
              mauris cursus mattis. Accumsan lacus vel facilisis volutpat. Sed
              risus ultricies tristique nulla aliquet enim tortor. Mauris cursus
              mattis molestie a iaculis. Adipiscing diam donec adipiscing
              tristique risus nec feugiat in. Mauris in aliquam sem fringilla ut
              morbi tincidunt augue. Leo vel fringilla est ullamcorper eget
              nulla facilisi etiam. Bibendum est ultricies integer quis auctor
              elit sed. Pulvinar neque laoreet suspendisse interdum consectetur
              libero id faucibus nisl. Id aliquet risus feugiat in ante metus
              dictum at tempor. Netus et malesuada fames ac turpis egestas
              maecenas pharetra convallis. Elementum nibh tellus molestie nunc
              non blandit massa enim.
            </p>
            <p>
              Massa vitae tortor condimentum lacinia quis vel eros donec ac.
              Luctus venenatis lectus magna fringilla. Et egestas quis ipsum
              suspendisse ultrices gravida dictum fusce. Adipiscing elit ut
              aliquam purus. Turpis massa sed elementum tempus. Pellentesque
              adipiscing commodo elit at imperdiet dui accumsan sit. Justo
              laoreet sit amet cursus. Aliquet risus feugiat in ante metus
              dictum. Lobortis mattis aliquam faucibus purus in. Egestas erat
              imperdiet sed euismod nisi porta lorem. Egestas congue quisque
              egestas diam in arcu cursus euismod quis.
            </p>
            <p>
              Platea dictumst quisque sagittis purus sit. Lorem ipsum dolor sit
              amet. Rutrum quisque non tellus orci ac auctor augue. Tellus
              rutrum tellus pellentesque eu tincidunt tortor. Facilisi etiam
              dignissim diam quis enim lobortis scelerisque. Nunc mattis enim ut
              tellus elementum sagittis vitae et. At varius vel pharetra vel
              turpis nunc eget lorem dolor. Consectetur lorem donec massa sapien
              faucibus et molestie ac feugiat. Arcu bibendum at varius vel
              pharetra vel. Nec feugiat in fermentum posuere urna nec.
              Vestibulum lectus mauris ultrices eros in. Sagittis aliquam
              malesuada bibendum arcu vitae elementum. Et molestie ac feugiat
              sed lectus vestibulum mattis ullamcorper velit. Facilisis volutpat
              est velit egestas dui id ornare. Orci sagittis eu volutpat odio.
              At risus viverra adipiscing at in tellus integer feugiat
              scelerisque. At risus viverra adipiscing at in tellus integer
              feugiat. Neque laoreet suspendisse interdum consectetur libero id.
              Semper risus in hendrerit gravida rutrum quisque.
            </p>
            <p>
              Et ligula ullamcorper malesuada proin libero nunc consequat
              interdum varius. At lectus urna duis convallis. Etiam dignissim
              diam quis enim. Amet est placerat in egestas erat imperdiet.
              Turpis egestas maecenas pharetra convallis posuere. Nunc lobortis
              mattis aliquam faucibus purus in massa tempor nec. Eu ultrices
              vitae auctor eu augue. Nunc mi ipsum faucibus vitae aliquet nec
              ullamcorper sit amet. Scelerisque in dictum non consectetur.
              Platea dictumst vestibulum rhoncus est pellentesque elit
              ullamcorper. Feugiat scelerisque varius morbi enim nunc faucibus.
            </p>
            <p>
              Volutpat maecenas volutpat blandit aliquam etiam erat velit.
              Ullamcorper a lacus vestibulum sed arcu non odio. Vel fringilla
              est ullamcorper eget nulla. Vitae turpis massa sed elementum
              tempus egestas. Habitant morbi tristique senectus et netus.
              Pharetra convallis posuere morbi leo urna molestie at.
              Pellentesque habitant morbi tristique senectus et. Molestie at
              elementum eu facilisis sed odio. Nullam eget felis eget nunc
              lobortis mattis aliquam. Urna condimentum mattis pellentesque id
              nibh tortor id.
            </p>
          </div>
          <div className="terms-of-use-buttons">
            <button
              className="terms-of-use-button"
              onClick={handleDeclineTerms}
            >
              Decline
            </button>
            <button className="terms-of-use-button" onClick={handleAcceptTerms}>
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TermsOfUse = (props: ITermsOfUseProps) => {
  const { setIsTermsOfUseDialogDisplayed, setTermsOfUseAcknowledged } = props;

  const dismissTermsOfUseDialog = () => {
    setIsTermsOfUseDialogDisplayed(false);
  };

  return (
    <div>
      <div className="overlay" onClick={dismissTermsOfUseDialog}></div>
      <TermsOfUseDialog
        dismissTermsOfUseDialog={dismissTermsOfUseDialog}
        setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
        setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
      />
    </div>
  );
};

export default TermsOfUse;
